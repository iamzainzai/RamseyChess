import { Component } from '@angular/core';

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
}
