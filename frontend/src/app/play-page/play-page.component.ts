import { Component } from '@angular/core';
import { NavMenuComponent } from '../navmenu/navmenu.component';
import { StrategyCardData, mockStrategyCardData } from 'src/models/start-card.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css'],
})

export class PlayPageComponent {
  cards: StrategyCardData[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<StrategyCardData[]>('/api/get_public_strats')
      .subscribe(
        (data: StrategyCardData[]) => {
          // Assign the fetched data to the cards array
          this.cards = data;
        },
        (error) => {
          console.error('Error fetching strategy cards', error);
          this.cards = mockStrategyCardData
        }
      );
  }
  
}
