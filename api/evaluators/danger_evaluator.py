import chess
from data_access.danger_manager import EvaluateDangerDoc

class DangerEvaluator():
    def __init__(self, eval_manager : EvaluateDangerDoc, board) -> None:
        """Returns """
        self.board = board
        self.eval_manager : EvaluateDangerDoc = eval_manager
    
    def set_board(self,board):
        self.board = board
    
    def calculate(self) -> float:
        all_pieces = self.board.piece_map()
        white_hanging_pieces = 0
        black_hanging_pieces = 0

        for square, piece in all_pieces.items():
            attackers = len(self.board.attackers(not piece.color, square))
            defenders = len(self.board.attackers(piece.color, square))
            
            # Check if the piece is hanging (more attackers than defenders)
            if attackers > defenders:
                if piece.color == chess.WHITE:
                    white_hanging_pieces += 1
                elif piece.color == chess.BLACK:
                    black_hanging_pieces += 1

        # Calculate the difference: positive if black has more hanging pieces, negative if white has more
        hanging_difference = black_hanging_pieces - white_hanging_pieces

        # Apply the weight if there is a difference in hanging pieces
        return hanging_difference * self.eval_manager["whitePieces"]["hangingPieces"]
            
    def _is_attacked(self, piece, square) -> int:
        """Checks if the given piece at the specified square is attacked."""
        color = piece.color
        attackers = self.board.attackers(not color, square)
        return len(attackers)
    
    def __str__(self):
        return (
            f"DangerEvaluator("
            f"whitePieces: {self.eval_manager['whitePieces']}, "
            f"board_fen: {self.board.fen()}"
            f")"
        )