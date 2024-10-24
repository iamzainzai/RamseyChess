import chess

class Minimax:
    def __init__(self, evaluator, depth=1, debug=False):
        self.evaluator = evaluator
        self.depth = depth
        self.debug = debug
       

    def minimax(self, board, depth, maximizing_player):
        self.evaluator.set_board(board)
        with open("debug.txt", "a") as debug_file:
            if self.debug:
                debug_file.write(f"Minimax call - Depth: {depth}, Maximizing: {maximizing_player}\n")
        if depth == 0 or board.is_game_over():
            score = self.evaluator.calculate()
            if self.debug:
                with open("debug.txt", "a") as debug_file:
                    debug_file.write(f"Reached leaf node or game over. Evaluation score: {score}\n")
            return score

        if maximizing_player:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                if self.debug:
                    with open("debug.txt", "a") as debug_file:
                        debug_file.write(f"Trying move: {move}\n")
                eval = self.minimax(board, depth - 1, False)
                board.pop()
                max_eval = max(max_eval, eval)
            if self.debug:
                with open("debug.txt", "a") as debug_file:
                    debug_file.write(f"Maximizing player - Best evaluation: {max_eval}\n")
            return max_eval
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                if self.debug:
                    with open("debug.txt", "a") as debug_file:
                        debug_file.write(f"Trying move: {move}\n")
                eval = self.minimax(board, depth - 1, True)
                board.pop()
                min_eval = min(min_eval, eval)
            if self.debug:
                with open("debug.txt", "a") as debug_file:
                    debug_file.write(f"Minimizing player - Best evaluation: {min_eval}\n")
            return min_eval

    def find_best_move(self, board):
        self.evaluator.set_board(board)
        best_move = None
        if board.turn == chess.WHITE:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                if self.debug:
                    with open("debug.txt", "a") as debug_file:
                        debug_file.write(f"Evaluating move for white: {move}\n")
                eval = self.minimax(board, self.depth - 1, False)
                board.pop()
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
            if self.debug:
                with open("debug.txt", "a") as debug_file:
                    debug_file.write(f"Best move for white: {best_move} with evaluation: {max_eval}\n")
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                if self.debug:
                    with open("debug.txt", "a") as debug_file:
                        debug_file.write(f"Evaluating move for black: {move}\n")
                eval = self.minimax(board, self.depth - 1, True)
                board.pop()
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
            if self.debug:
                with open("debug.txt", "a") as debug_file:
                    debug_file.write(f"Best move for black: {best_move} with evaluation: {min_eval}\n")
        return best_move

if __name__ == "__main__":
    from data_access.material_manager import EvaluateMaterialManager
    from evaluators.material_evaluator import MaterialEvaluator
    em = EvaluateMaterialManager()
    em.loadOne("default")
    eval_manager = em.getCurrent()

    board = chess.Board("rnb1kbnr/pp1ppppp/2p5/q7/Q7/2P5/PP1PPPPP/RNB1KBNR b KQkq - 0 3")

    matEval = MaterialEvaluator(eval_manager=eval_manager,board=board)

    if board.turn == chess.WHITE:
        for piece , value in list(matEval.eval_manager["ownPieces"].items()):
            eval_manager["ownPieces"][piece] = -value
    if board.turn == chess.BLACK:
        for piece , value in list(matEval.eval_manager["opponentPieces"].items()):
            eval_manager["opponentPieces"][piece] = -value    

    print(matEval.eval_manager)
        

    minimax = Minimax(evaluator=matEval, depth=3)
    best_move = minimax.find_best_move(board)
    print(board.san(best_move))