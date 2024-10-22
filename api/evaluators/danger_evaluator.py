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
        own_pieces = self.board.piece_map()
        attacked_pieces = 0

        for square , piece in own_pieces.items():
            attacked_pieces += self._is_attacked(piece, square)
        
        return self.eval_manager["ownPieces"]["attackedPieces"] * attacked_pieces #type: ignore[index]
    
    def _is_attacked(self, piece, square) -> int:
        """Checks if the given piece at the specified square is attacked."""
        color = piece.color
        attackers = self.board.attackers(not color, square)
        return len(attackers)