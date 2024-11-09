import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { HttpClient } from '@angular/common/http';
import { PlayAiService } from '../services/play-ai.service';
import { EvalService } from '../services/eval-service.service';
import { NextMove } from 'src/models/next-move.model';

@Component({
  selector: 'app-play-bots-page',
  templateUrl: './play-bots-page.component.html',
  styleUrls: ['./play-bots-page.component.css']
})
export class PlayBotsPageComponent {
  @ViewChild('chessBoard') chessBoard!: NgxChessBoardComponent;
  currentFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  boardSize = 600
  isPlaying: boolean = false;
  numMoves: number = 1;

  whiteStrategyId : string = "";
  blackStrategyId : string = "";


  constructor(private router: Router, private http: HttpClient, private play_ai : PlayAiService, private eval_service : EvalService ,private cdr: ChangeDetectorRef) {}

  onMoveChange() {
    const fen = this.chessBoard.getFEN();
    this.currentFen = fen
    console.log('Current FEN:', fen);
    this.eval_service.updateFen(this.currentFen);
  }

  async playTwoMoves()
  {
    this.isPlaying = true;
    for (let i = 0; i < 2; i++) 
    {
      const res: NextMove | {} = await this.play_ai.getNextMoveByStratId(this.currentFen, "671afaa69eb0593a9dea2024", 2);
      if ('best_move' in res && typeof res.best_move === 'string') 
      {
        this.chessBoard.move(res.best_move);
        this.currentFen = this.chessBoard.getFEN()
      } 
      else 
      {
        console.log("An error occurred while requesting a move for that strategy");
        break;
      }
    }
    this.isPlaying = false
  }

  async playNMoves(n: number, whiteStrategy: string, blackStrategy: string)
  {
    this.isPlaying = true;
  
    for (let i = 0; i < n; i++) 
    {
      const currentTurn = this.getCurrentTurn();
      const strategy = (currentTurn === 'w') ? whiteStrategy : blackStrategy;
  
      const res: NextMove | {} = await this.play_ai.getNextMoveByStratId(this.currentFen, strategy, 2);
      if ('best_move' in res && typeof res.best_move === 'string') 
      {
        this.chessBoard.move(res.best_move);
        this.currentFen = this.chessBoard.getFEN();
      } 
      else 
      {
        console.log('An error occurred while requesting a move for that strategy');
        break;
      }
    }
  
    this.isPlaying = false;
  }

  // Responsive board
  updateBoardSize(): number {
    const viewportWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    this.boardSize = viewportWidth * 0.8 > 600 ? 600 : viewportWidth * 0.8;
    console.log(viewportWidth)
    return this.boardSize;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateBoardSize();
    this.cdr.detectChanges();
  }

  getCurrentTurn(): 'w' | 'b' {
    const fen = this.chessBoard.getFEN();
    const fenParts = fen.split(' ');
    return fenParts[1] as 'w' | 'b';
  }

}
