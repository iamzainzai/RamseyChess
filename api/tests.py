import unittest
import chess
from evaluators.danger_evaluator import DangerEvaluator
from data_access.danger_manager import EvaluateDangerDoc

class TestDangerEvaluator(unittest.TestCase):
    def setUp(self):
        # Mock evaluation manager with hanging piece weight
        self.eval_manager = {
            "_id": {"$oid": "67173cdf42b47fc669033e9e"},
            "name": "default",
            "whitePieces": {
                "hangingPieces": 1.0,
                "attackedPieces": 3
            },
            "blackPieces": {
                "hangingPieces": 1.0,
                "attackedPieces": 3
            },
            "owner": None
        }

    def test_no_hanging_pieces(self):
        board = chess.Board()  # Default starting position with no pieces under attack
        evaluator = DangerEvaluator(eval_manager=self.eval_manager, board=board)
        self.assertEqual(evaluator.calculate(), 0.0)


    def test_pawn_capture(self):
        board = chess.Board() 
        board.set_fen("rnbqkbnr/ppp2ppp/8/3pp3/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq e6 0 1")
        evaluator = DangerEvaluator(eval_manager=self.eval_manager, board=board)
        self.assertEqual(evaluator.calculate(), 1.0)

    def test_pawn_protected(self):
        board = chess.Board() 
        board.set_fen("rnbqkbnr/ppp3pp/5p2/3pp3/3P4/2P1P3/PP3PPP/RNBQKBNR w KQkq - 0 1")
        evaluator = DangerEvaluator(eval_manager=self.eval_manager, board=board)
        self.assertEqual(evaluator.calculate(), 0.0)

    def test_bishop_hanging(self):
        board = chess.Board() 
        board.set_fen("rn1qkbnr/ppp3p1/5p1p/3pp3/3P2b1/2P1P3/PP1N1PPP/R1BQKBNR b KQkq - 0 1")
        evaluator = DangerEvaluator(eval_manager=self.eval_manager, board=board)
        self.assertEqual(evaluator.calculate(), 1.0)

    def test_black_three_hanging(self):
        board = chess.Board() 
        board.set_fen("r1nqkb1r/p1p3p1/1p3p1p/1n1pp3/P2P2b1/2P1P3/1P1N1PPP/R1BQKBNR b KQkq a3 0 1")
        evaluator = DangerEvaluator(eval_manager=self.eval_manager, board=board)
        self.assertEqual(evaluator.calculate(), 2.0)

if __name__ == '__main__':
    unittest.main()