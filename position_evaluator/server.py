from flask import Flask, request, jsonify
import chess
from flasgger import Swagger

from data_access.material_manager import EvaluateMaterialManager
from data_access.danger_manager import EvaluateDangerManager

from evaluators.material_evaluator import MaterialEvaluator
from evaluators.danger_evaluator import DangerEvaluator

import json
from bson.json_util import dumps , loads
from bson import ObjectId
from minimax import Minimax


app = Flask(__name__)
swagger = Swagger(app)

@app.route('/gen_evaluate', methods=['POST'])
def evaluate_material():
  """
  Evaluate the material and danger scores for a given chess position.
  This endpoint computes both the material score and the danger score 
  based on the current board position represented by the FEN string. 
  Users must provide the evaluation names for both material and danger 
  scoring.

  ---
  parameters:
    - name: body
      in: body
      required: true
      schema:
        type: object
        properties:
          fen:
            type: string
            example: 'r1b2r2/p2p1pk1/1qp1pN1p/3nP1p1/2B4Q/3R4/PPP2PPP/2K4R w - - 1 0'
            description: FEN string representing the current chess position.
          mat_eval_name:
            type: string
            example: 'default'
            description: Name of the material evaluation configuration to use.
          dan_eval_name:
            type: string
            example: 'default'
            description: Name of the danger evaluation configuration to use.
  responses:
    200:
      description: A JSON object containing both the material score and danger score.
      schema:
        type: object
        properties:
          material_score:
            type: number
            description: The calculated material score based on the board position.
          danger_score:
            type: number
            description: The calculated danger score based on the board position.
  """
  data    = request.get_json()

  fen       = data.get("fen", None)
  mat_eval_name = data.get("mat_eval_name", None)
  dan_eval_name = data.get("dan_eval_name", None)
  
  board = chess.Board(fen)

  # Accesso a la BD
  em = EvaluateMaterialManager()
  em.loadOne(mat_eval_name)
  material_scoring = em.getCurrent()
  
  ed = EvaluateDangerManager()
  ed.loadOne(dan_eval_name)
  danger_scoring = ed.getCurrent()

  # Computación del score
  matEval = MaterialEvaluator(material_scoring, board)
  danEval = DangerEvaluator(danger_scoring, board)

  mat_score = matEval.calculate()
  dan_score = danEval.calculate()

  return jsonify({
     "material_score" : mat_score,
     "danger_score" : dan_score
  })

@app.route('/mat_eval', methods=['POST'])
def material_eval():
    data = request.get_json()
    fen = data.get("fen", None)
    eval_name = data.get("eval_name", None)
    depth = data.get("depth", 1)
    
    board = chess.Board(fen)
    
    # Load material evaluation parameters
    em = EvaluateMaterialManager()
    em.loadOne(eval_name)
    material_scoring = em.getCurrent()
    
    matEval = MaterialEvaluator(eval_manager=material_scoring, board=board)
    matEval.set_board(board)
    minimax = Minimax(evaluator=matEval, depth=depth)
    
    best_move = minimax.find_best_move(board)
    
    return jsonify({
        "best_move": board.san(best_move),
        "material_score": matEval.calculate()
    })

@app.route('/danger_eval', methods=['POST'])
def danger_eval():
  data      = request.get_json()
  fen       = data.get("fen", None)
  eval_name = data.get("eval_name", None)

  board = chess.Board(fen)

  ed = EvaluateDangerManager()
  ed.loadOne(eval_name)
  danger_scoring = ed.getCurrent()

  danEval = DangerEvaluator(eval_manager=danger_scoring, board=board)

  legal_moves_fen = {}
  for move in board.legal_moves:
    board_copy = board.copy(stack=False)
    board_copy.push(move)
    # Get the FEN for the new position
    danEval.set_board(board_copy)
    legal_moves_fen[str(board.san(move))] = danEval.calculate()

  for move, score in legal_moves_fen.items():
      print(f"Move: {move}, score: {score}")

  if board.turn == chess.WHITE:
    best_move = max(legal_moves_fen, key=legal_moves_fen.get)
  else:
    best_move = min(legal_moves_fen, key=legal_moves_fen.get)

  return jsonify({
    "best_move": best_move,
    "danger_score" : legal_moves_fen[best_move]
    })

@app.route('/get_evaluators', methods=['GET'])
def get_evaluators():
  """
  Retrieve all evaluators with a null owner.
  This endpoint returns two lists: one for material evaluators and one for danger evaluators,
  both of which have no assigned owner.
  ---
  responses:
    200:
      description: A JSON object containing lists of material and danger evaluators with no owner.
      schema:
        type: object
        properties:
          material_evaluators:
            type: array
            items:
              type: object
              description: A list of material evaluators with null owner.
          danger_evaluators:
            type: array
            items:
              type: object
              description: A list of danger evaluators with null owner.
  """
  em = EvaluateMaterialManager()
  ed = EvaluateDangerManager()

  public_ems = em.getNullOwner()
  public_eds = ed.getNullOwner()

  return jsonify({
    "material_evaluators" : public_ems,
    "danger_evaluators": public_eds
  })

@app.route('/mat_eval_debug', methods=['POST'])
def material_eval_debug():
    data = request.get_json()
    fen = data.get("fen", None)
    eval_name = data.get("eval_name", None)
    depth = data.get("depth", 1)
    debug = data.get("debug", False)
    
    board = chess.Board(fen)
    
    # Load material evaluation parameters
    em = EvaluateMaterialManager()
    em.loadOne(eval_name)
    material_scoring = em.getCurrent()
    
    matEval = MaterialEvaluator(eval_manager=material_scoring, board=board)
    minimax = Minimax(evaluator=matEval, depth=depth, debug=debug)
    
    best_move = minimax.find_best_move(board)
    
    response = {
        "best_move": board.san(best_move),
        "material_score": matEval.calculate()
    }
    
    if debug:
        response["debug_info"] = [
            f"After move {board.san(move)}: {board.fen()}" for move in board.legal_moves
        ]
    
    return jsonify(response)

if __name__ == '__main__':
  app.run(debug=True)