import chess

class Minimax:
    def __init__(self, evaluator, depth=1, debug=False):
        self.evaluator = evaluator
        self.depth = depth
        self.debug = debug

    def minimax(self, board, depth, maximizing_player):
        self.evaluator.set_board(board)
        if depth == 0 or board.is_game_over():
            return self.evaluator.calculate()

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
        self.evaluator.set_board(board)
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