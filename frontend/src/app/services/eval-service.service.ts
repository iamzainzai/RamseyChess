import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

interface ChessPieces {
  pawn  : number;
  knight: number;
  bishop: number;
  rook  : number;
  queen : number;
  king  : number;
}

interface MatevalModel {
  name       : string;
  whitePieces: ChessPieces;
  blackPieces : ChessPieces;
  owner      : string | null;
}


@Injectable({
  providedIn: 'root'
})
export class EvalService {
  currentFen$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentEvalModel$: BehaviorSubject<MatevalModel | null> = new BehaviorSubject<MatevalModel | null>(null);
  
  bestMove$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  bestMoveReadable$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  currentDepth$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);


constructor(private http: HttpClient) {}

  // Method to update the currentEvalModel
  updateEvalModel(newModel: MatevalModel) {
    this.currentEvalModel$.next(newModel);
  }

  // Method to update the currentFen
  updateFen(newFen: string) {
    this.currentFen$.next(newFen);
  }

  // Method to send execution request
  sendExec(): Promise<{ best_move: string | null, best_move_readable: string | null } | null> {
    return new Promise((resolve, reject) => {
      const currentModel = this.currentEvalModel$.getValue();
      const currentFen = this.currentFen$.getValue();
      const moveDepth = this.currentDepth$.getValue();
  
      if (!currentModel || !currentFen || moveDepth === null) {
        resolve(null);  // Ensure depth is available before proceeding
        return;
      }  
      const payload = { model: currentModel, fen: currentFen, depth: moveDepth };
      
      this.http.post('/api/submit_exec', payload).subscribe(
        (response: any) => {
          console.log('Response from server:', response);
          this.bestMove$.next(response.best_move);
          this.bestMoveReadable$.next(response.best_move_readable);
          resolve({
            best_move: this.bestMove$.getValue(),
            best_move_readable: this.bestMoveReadable$.getValue()
          });
        },
        (error) => {
          console.error('Error occurred:', error);
          reject(error);
        }
      );
    });
  }
}