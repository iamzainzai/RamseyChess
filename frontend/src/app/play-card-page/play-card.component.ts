import { Component, OnInit, ViewChild } from '@angular/core';
import { StrategyCardData } from 'src/models/start-card.model';
import { PlayAiService } from '../services/play-ai.service';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';

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
      this.play_ai.getNextMoveByStratId(this.currentFen, this.cardId)
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
  }
}
