import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/shared/game.model';
import { GameService } from 'src/app/shared/game.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {
  @Input() game: Game;
  @Input() index: number;
  winner: string;
  gamesPlayed: number;
  team1Totals: number;
  team1WinRatio: number;
  team2Totals: number;
  team2WinRatio: number;
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.gameChanged.subscribe((game: Game) => {
      this.game = game;
    });
    this.getWinner();
  }
  getWinner() {
    let team1Total = 0;
    let team2Total = 0;
    let team1Score = 0;
    let team2Score = 0;
    if (this.game.team1.bonus) {
      for (const num of this.game.team1.bonus) {
        team1Total = team1Total + num;
      }
    }
    if (this.game.team1.score) {
      for (const num of this.game.team1.score) {
        team1Total = team1Total + num;
        team1Score = team1Score + num;
      }
    }
    if (this.game.team2.bonus) {
      for (const num of this.game.team2.bonus) {
        team2Total = team2Total + num;
      }
    }
    if (this.game.team2.score) {
      for (const num of this.game.team2.score) {
        team2Total = team2Total + num;
        team2Score = team2Score + num;
      }
    }

    this.team1Totals = team1Total;
    this.team2Totals = team2Total;
    this.gamesPlayed = this.game.gamesPlayed;
    if (this.gamesPlayed !== 0) {
      this.team1WinRatio = (this.game.team1.gamesWon / this.gamesPlayed);
      this.team2WinRatio = (this.game.team2.gamesWon / this.gamesPlayed);
    }

    if (team1Total > team2Total) {
      this.winner = this.game.team1.name;
    }
    if (team2Total > team1Total) {
      this.winner = this.game.team2.name;
    }
    if (team1Total === team2Total) {
      this.winner = 'Tie';
    }
  }

}
