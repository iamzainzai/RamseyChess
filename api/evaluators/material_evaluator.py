from data_access.material_manager import  EvaluateMaterialDoc
import chess

class MaterialEvaluator():
    def __init__(self, eval_manager : EvaluateMaterialDoc, board) -> None:
        """ Simple summatory of your pieces values"""
        self.board = board
        self.eval_manager  : EvaluateMaterialDoc = eval_manager
    
    def set_board(self,board):
        self.board = board
    
    def calculate(self) -> float:
        own_score      = 0.0
        opponent_score = 0.0

        for piece_type in ["pawn", "knight", "bishop", "rook", "queen"]: 
            if self.board.turn == chess.WHITE:
                own_score      += len(self.board.pieces(getattr(chess, piece_type.upper()), chess.WHITE)) * self.eval_manager["ownPieces"][piece_type] #type: ignore[index]
                opponent_score += len(self.board.pieces(getattr(chess, piece_type.upper()), chess.BLACK)) * self.eval_manager["opponentPieces"][piece_type] #type: ignore[index]
            else:
                own_score      += len(self.board.pieces(getattr(chess, piece_type.upper()), chess.BLACK)) * self.eval_manager["ownPieces"][piece_type] #type: ignore[index]
                opponent_score += len(self.board.pieces(getattr(chess, piece_type.upper()), chess.WHITE)) * self.eval_manager["opponentPieces"][piece_type]  #type: ignore[index]

        return own_score - opponent_score     
