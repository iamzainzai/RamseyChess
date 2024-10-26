import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of , firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StrategyCardData, mockStrategyCardData } from 'src/models/start-card.model';
import { NextMove } from 'src/models/next-move.model';


@Injectable({
  providedIn: 'root'
})
export class PlayAiService {
  
  constructor(private http: HttpClient) {}

  fetchStrategyCards() {
    return this.http.get<StrategyCardData[]>('/api/get_public_strats').pipe(
      catchError(error => {
        console.error('Error fetching strategy cards', error);
        return of(mockStrategyCardData); // Return mock data in case of error
      })
    );
  }

  ping() {
    console.log("Play ai running");
  }
  async getNextMoveByStratId(fen: string, strat_id: string): Promise<NextMove | {}> {
    console.log("Fetching next move for strategy ID:", strat_id);
    try {
      const nextMove = await firstValueFrom(
        this.http.post<NextMove>('/api/get_next_move_by_strat_id', { fen, strat_id }).pipe(
          catchError(error => {
            console.error('Error fetching next move', error);
            return of({}); // Return an empty object or handle appropriately
          })
        )
      );
      console.log('Next move fetched:', nextMove);
      return nextMove;
    } catch (error) {
      console.error('Error fetching next move:', error);
      return {}; // Return an empty object or handle appropriately
    }
  }
}
