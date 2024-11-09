import { Component, OnInit, ViewChild } from '@angular/core';
import { StrategyCardData } from 'src/models/start-card.model';
import { PlayAiService } from '../services/play-ai.service';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { NextMove } from 'src/models/next-move.model';
import { Chess } from 'chess.js';

@Component({
  selector: 'app-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.css'],
})

export class PlayAiCardComponent implements OnInit {
  @ViewChild('chessBoard') chessBoard!: NgxChessBoardComponent;
  strategy_card : StrategyCardData | null = null;
  cardId: string | null = null;
  boardSize: number = 400;
  gameFinished = false;
  currentFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  constructor(private play_ai: PlayAiService, private route: ActivatedRoute) {}

  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.cardId = params['id']; 
    }); 

  }
  requestMoveByAi() 
  {
    if (this.currentFen && this.cardId) 
    {
      this.play_ai.getNextMoveByStratId(this.currentFen, this.cardId, 2)
        .then(nextMove => {
          console.log('Next move received:', nextMove);
        })
        .catch(error => {
          console.error('Error fetching next move:', error);
        });
    } 
  }
  onMoveChange() 
  {
    const fen = this.chessBoard.getFEN();
    this.currentFen = fen
    console.log('Current FEN:', fen);
    const activeColor = fen.split(' ')[1]; 
    if (activeColor == 'b')
    {
      this.play_ai.getNextMoveByStratId(fen, this.cardId, 2).then( (res : NextMove | {}) =>
      {  
        console.log(res)
        if ('best_move' in res && res.best_move != "")
        {
          this.chessBoard.move(res.best_move)
        }
        else
        {
          console.log("Trying a random move")
          const randomMove = this.getRandomLegalMove(fen);
          console.log(randomMove)
          this.chessBoard.move(randomMove);
        }
        
      })
      .catch(() => {
      });
    }
  }

  getRandomLegalMove(fen: string): string {
    const chess = new Chess(fen);
    const legalMoves = chess.moves({ verbose: true }); // Get detailed move objects
  
    if (legalMoves.length === 0) {
      return ""; // No legal moves available
    }
  
    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    const randomMove = legalMoves[randomIndex];
  
    return randomMove.from + randomMove.to; // Return the move in source + target format (e.g., e2e4)
  }
}
