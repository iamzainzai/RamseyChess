import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EvalService } from '../services/eval-service.service';

interface ChessPieces {
  pawn  : number;
  knight: number;
  bishop: number;
  rook  : number;
  queen : number;
  king  : number;
}

interface MatevalModel {
  name          : string;
  ownPieces     : ChessPieces;
  opponentPieces: ChessPieces;
  owner         : string | null;
}

@Component({
  selector: 'app-mat-eval',
  templateUrl: './mateval.component.html',
  styleUrls: ['./mateval.component.css']
})
export class MatevalComponent {
  @Input() currentFen : string = "";
  model: MatevalModel = {
    name: 'default',
    ownPieces: {
      pawn  : 1,
      knight: 3,
      bishop: 3,
      rook  : 5,
      queen : 9,
      king  : 20
    },
    opponentPieces: {
      pawn  : 1,
      knight: 3,
      bishop: 3,
      rook  : 5,
      queen : 9,
      king  : 20
    },
    owner: null
  };
  bestMove : string | null = null

  constructor(private http: HttpClient, private eval_service : EvalService) {}

  validatePositiveFloat(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && parseFloat(inputElement.value) <= -0.001) 
    {
      inputElement.value = ''; 
    }
  }

  onSubmit(): void {
    console.log('Form submitted:', this.model);
  }

  pingFlask() {
    this.eval_service.currentEvalModel = this.model;
    this.eval_service.currentFen = this.currentFen;
  
    this.eval_service.sendExec().then((bestMove: string | null) => {
      if (bestMove) {
        this.bestMove = bestMove;
        console.log('Best move:', this.bestMove);
      } else {
        console.log('No best move found.');
      }
    }).catch((error) => {
      console.error('Error occurred:', error);
    });
  }

}
