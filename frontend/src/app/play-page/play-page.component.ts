import { Component, OnInit } from '@angular/core';
import { StrategyCardData } from 'src/models/start-card.model';
import { PlayAiService } from '../services/play-ai.service';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css'],
})
export class PlayPageComponent implements OnInit {
  cards: StrategyCardData[] = [];

  constructor(private play_ai: PlayAiService) {}

  ngOnInit(): void {
    this.play_ai.fetchStrategyCards().subscribe(
      (data: StrategyCardData[]) => {
        this.cards = data;
      }
    );
  }

  getCardUrl(id: string): string {
    return `/play-ai/${id}`; 
  }
}
