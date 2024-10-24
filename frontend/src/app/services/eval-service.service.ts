import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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


@Injectable({
  providedIn: 'root'
})
export class EvalService {
  currentFen : string = ""
  currentEvalModel: MatevalModel | null = null
  bestMove : string | null = null

  constructor(private http : HttpClient) { }

  sendExec(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.currentEvalModel) {
        resolve(null);
        return;
      }
  
      const payload: any = { "model": this.currentEvalModel, "fen": this.currentFen };
      this.http.post('/api/submit_exec', payload).subscribe(
        (response: any) => {
          console.log('Response from server:', response);
          this.bestMove = response.best_move;
          resolve(this.bestMove);
        },
        (error) => {
          console.error('Error occurred:', error);
          reject(error);
        }
      );
    });
  }

  
}
