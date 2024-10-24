import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { MatevalComponent } from '../mateval/mateval.component';
import { MinimaxComponent } from '../minimax/minimax.component';
import { HttpClient } from '@angular/common/http';
import { EvalService } from 'src/app/services/eval-service.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent implements AfterViewInit {
  @ViewChild('chessBoard') chessBoard!: NgxChessBoardComponent;
  boardSize: number = 400;
  gameFinished = false;
  currentFen : string = ""
  constructor(private router: Router, private http: HttpClient, private eval_service: EvalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateBoardSize();
        // Subscribe to bestMoveReadable$ to trigger move on chessboard
    this.eval_service.bestMove$.subscribe((bestMove: string | null) => {
      if (bestMove) {
        console.log('Moving piece to:', bestMove);
        this.chessBoard.move(bestMove);
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateBoardSize();
  }
  
  ngAfterViewInit() {
      this.chessBoard.reset();
      this.currentFen = this.chessBoard.getFEN();
      this.eval_service.updateFen(this.currentFen);    
  }

  onGameEnd() {
    this.gameFinished = true;
  }

  reset() {
    this.chessBoard.reset()
    this.currentFen = this.chessBoard.getFEN()
    this.eval_service.updateFen(this.currentFen);
  }
  onMoveChange() {
    const fen = this.chessBoard.getFEN();
    this.currentFen = fen
    console.log('Current FEN:', fen);
    this.eval_service.updateFen(this.currentFen);
  }

  updateBoardSize(): number {
    const viewportWidth = window.innerWidth;
    this.boardSize = viewportWidth * 0.8 > 400 ? 400 : viewportWidth * 0.8;
    console.log(this.boardSize)
    return this.boardSize;
  }

}
