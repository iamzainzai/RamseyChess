import chess

class Minimax:
    def __init__(self, evaluator, depth=1, debug=False):
        self.evaluator = evaluator
        self.depth = depth
        self.debug = debug
       
 

    def minimax(self, board, depth, maximizing_player):
        for evaluator in self.evaluator:
            evaluator.set_board(board)
        
        if depth == 0 or board.is_game_over():
            return sum(evaluator.calculate() for evaluator in self.evaluator)

        if maximizing_player:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, depth - 1, False)
                board.pop()
                max_eval = max(max_eval, eval)
            return max_eval
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, depth - 1, True)
                board.pop()
                min_eval = min(min_eval, eval)
            return min_eval

    def find_best_move(self, board):
        for evaluator in self.evaluator:
            evaluator.set_board(board)
        
        best_move = None
        if board.turn == chess.WHITE:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, self.depth - 1, False)
                board.pop()
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval = self.minimax(board, self.depth - 1, True)
                board.pop()
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
        return best_move


if __name__ == "__main__":
    from data_access.material_manager import EvaluateMaterialManager
    from evaluators.material_evaluator import MaterialEvaluator
    em = EvaluateMaterialManager()
    em.loadOne("default")
    eval_manager = em.getCurrent()

    board = chess.Board("rnb1k1nr/p1pp1pp1/p6p/2b1p1q1/4P3/PP1PB3/2P2PPP/RN1QK1NR b KQkq - 0 8")

    matEval = MaterialEvaluator(eval_manager=eval_manager,board=board)

    print(matEval.eval_manager)
        
    minimax = Minimax(evaluator=[matEval], depth=3)
    best_move = minimax.find_best_move(board)
    print(board.san(best_move))