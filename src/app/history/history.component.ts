import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../shared/game.model';
import { GameService } from '../shared/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  games: Game[];
  subscription: Subscription;
  constructor(private gameService: GameService) { }
  ngOnInit() {
    this.subscription = this.gameService.gamesChanged.subscribe((games: Game[]) => {
      this.games = games;
    });
    this.games = this.gameService.getGames();
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
