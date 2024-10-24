import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { MatevalComponent } from '../mateval/mateval.component';
import { MinimaxComponent } from '../minimax/minimax.component';
import { HttpClient } from '@angular/common/http';

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
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateBoardSize();
  }
  
  ngAfterViewInit() {
    // Now chessBoard is available, and we can call its methods safely.
    this.chessBoard.reset();
    this.currentFen = this.chessBoard.getFEN()
  }

  onGameEnd() {
    this.gameFinished = true;
  }

  reset() {
    this.chessBoard.reset()
    this.currentFen = this.chessBoard.getFEN()
  }
  onMoveChange() {
    const fen = this.chessBoard.getFEN();
    this.currentFen = fen
    console.log('Current FEN:', fen);
  }

  updateBoardSize(): void {
    const viewportWidth = window.innerWidth;
    this.boardSize = viewportWidth * 0.8 > 400 ? 400 : viewportWidth * 0.8;
  }

}
