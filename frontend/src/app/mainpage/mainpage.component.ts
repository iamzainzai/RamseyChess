import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChessBoardComponent } from 'ngx-chess-board';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent implements AfterViewInit {
  @ViewChild('chessBoard') chessBoard!: NgxChessBoardComponent;

  gameFinished = false;

  constructor(private router: Router) {}

  ngOnInit() { }

  ngAfterViewInit() {
    // Now chessBoard is available, and we can call its methods safely.
    this.chessBoard.reset();
  }

  onGameEnd() {
    this.gameFinished = true;
  }

  reset() {
    this.chessBoard.reset()
  }
}
