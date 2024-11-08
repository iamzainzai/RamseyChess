from flask import Flask, request, jsonify
import chess
from flasgger import Swagger
from flask_cors import CORS
from routes.public_routes.public_routes import public_routes


from data_access.material_manager import EvaluateMaterialManager
from data_access.danger_manager import EvaluateDangerManager

from evaluators.material_evaluator import MaterialEvaluator
from evaluators.danger_evaluator import DangerEvaluator

import json
from bson.json_util import dumps , loads
from bson import ObjectId
from minimax import Minimax


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
swagger = Swagger(app)

app.register_blueprint(public_routes)


@app.route('/gen_evaluate', methods=['POST'])
def evaluate_material():
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
    minimax = Minimax(evaluator=[matEval], depth=depth)
    
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
    minimax = Minimax(evaluator=[matEval], depth=depth, debug=debug)
    
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

@app.route('/submit_exec', methods=['POST'])
def submit_exec():
   req = request.get_json()
   eval_manager = req.get("model", None)
   fen = req.get("fen", None)
   depth = req.get("depth", 1)
   # Dont crash the server
   depth = min(depth, 4)

   board = chess.Board(fen)
   
   matEval = MaterialEvaluator(eval_manager=eval_manager,board=board)
   minimax = Minimax(evaluator=[matEval], depth=depth)
   
   best_move = minimax.find_best_move(board)
   
   return jsonify({
       "best_move" : best_move.uci(),
       "best_move_readable": board.san(best_move),
       "material_score": matEval.calculate()
   })

@app.route('/mixed_eval', methods=['POST'])
def mixed_eval():
   req                = request.get_json()
   selected_evaluators = req.get("evaluators", None)
   # This is a list of strategy types
   # {material_evaluator : {"name" : "pawns", "w": 1} , "danger_evaluator" : {"name": "coward", "w": 1}}
   fen   = req.get("fen", None)
   depth = req.get("depth", 1)

   depth = min(depth, 4)
   board = chess.Board(fen)

  # Accesso a la BD
   em = EvaluateMaterialManager()
   em.loadOne(selected_evaluators["material_evaluator"]["name"])
   material_scoring = em.getCurrent()
  # Accesso a BD para danger
   ed = EvaluateDangerManager()
   ed.loadOne(selected_evaluators["danger_evaluator"]["name"])
   danger_scoring = ed.getCurrent()

   matEval = MaterialEvaluator(eval_manager=material_scoring, board=board)
   danEval = DangerEvaluator(eval_manager=danger_scoring, board=board)
   print([matEval, danEval])
  # Both matEval and danEval implement the .calculate() method
   minimax = Minimax(evaluator=[matEval, danEval], depth=depth)
   best_move = minimax.find_best_move(board)

   return jsonify({
       "best_move": board.san(best_move),
       "evaluators_used": [str(matEval), str(danEval)]
   })

if __name__ == '__main__':
  app.run(debug=True)