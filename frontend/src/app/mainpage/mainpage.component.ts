import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';
import { MatevalComponent } from '../mateval/mateval.component';
import { MinimaxComponent } from '../minimax/minimax.component';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent implements AfterViewInit {
  @ViewChild('chessBoard') chessBoard!: NgxChessBoardComponent;

  gameFinished = false;
  currentFen : string = ""
  constructor(private router: Router) {}

  ngOnInit() {
    
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
    // You can perform other actions here, like updating a state or sending the FEN to a backend
  }
}
