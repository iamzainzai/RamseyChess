import { Component, Input, ViewChild , HostListener} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ActivatedRoute } from '@angular/router';
import { HistoryMove } from 'ngx-chess-board/lib/history-move-provider/history-move';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframepage',
  templateUrl: './iframepage.component.html',
  styleUrls: ['./iframepage.component.css']
})
export class IframepageComponent {
  isWhiteBoard: boolean = false;
  lightTileColor: string = '#EEEED2';
  darkTileColor: string = '#769656';
  hideControls: boolean = true;
  chessBoardSize: number = 535; // Default size

  @Input() onGameEnd!: () => void;

  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.updateChessBoardSize(); // Set initial size
    this.route.queryParams.subscribe((params) => {
      this.isWhiteBoard = params['isWhite'] ?? false;
      this.hideControls = params['hideControls'] === 'true';
      
    });

    window.addEventListener('message', (event) => {
      if (event.data.reset) {
        this.handleResetEvent();
      } else {
        this.handleMoveEvent(event.data);
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateChessBoardSize(); // Update size when window is resized
  }

  ngAfterViewInit() {
    const currBoardState = localStorage.getItem('board');
    if (currBoardState) {
      this.board.setFEN(currBoardState);
    }

    if (!this.isWhiteBoard) {
      setTimeout(() => {
        this.board.reverse();
      });
    }
  }

  onMove() {
    const lastMove = this.board.getMoveHistory().slice(-1)[0];
    window.parent.postMessage(lastMove, this.getMainPageUrl());
  }

  private handleResetEvent() {
    this.board.reset();

    if (!this.isWhiteBoard) {
      this.board.reverse();
    }

    localStorage.clear();
  }

  private handleMoveEvent(moveData: HistoryMove) {
    this.board.move(moveData.move);
    localStorage.setItem('board', this.board.getFEN());

    if (moveData.mate) {
      this.onGameEnd();
    }
  }

  private getMainPageUrl(): SafeResourceUrl {
    return `${window.location.origin}/mainpage`;
  }


  updateChessBoardSize(): void {
    const containerWidth = window.innerWidth * 1
    const containerHeight = window.innerHeight * 1

    this.chessBoardSize = Math.min(containerWidth, containerHeight);

    if (this.chessBoardSize < 300) {
      this.chessBoardSize = 300; // Minimum size is 300 pixels
    }
  }


}
