import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../shared/game.model'; import { GameService } from '../../shared/game.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  game: Game;
  subscription: Subscription;
  team1Name = 'Team 1';
  team2Name = 'Team 2';
  team1Danger = false;
  team2Danger = false;
  gamesPlayed = 0;
  isCheckingGame = false;
  isResetting = false;
  suit = 'clubs';
  doubleState = 'none';
  losingDoubleState = 'none';
  winningTeam = '';
  losingTeam = '';
  otherTeamVulnerable = false;
  losingTeamVulnerable = false;
  WinRangeOptions: Options = {
    floor: 7,
    ceil: 13,
    showTicks: true
  };
  betRangeOptions: Options = {
    floor: 7,
    ceil: 13,
    showTicks: true
  };
  wonStrikesRangeOptions: Options = {
    floor: 0,
    ceil: 12,
    showTicks: true
  };

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.gameChanged.subscribe((game: Game) => {
      this.game = game;
      this.gamesPlayed = game.gamesPlayed;
    });
    this.game = this.gameService.getGame();
    this.gamesPlayed = this.game.gamesPlayed;
    this.team1Name = this.game.team1.name;
    this.team2Name = this.game.team2.name;
    this.isDanger();
  }

  changeSuit(suit: string) {
    this.suit = suit;
  }
  changeDoubleState(state: string) {
    this.doubleState = state;
  }
  changeLosingDoubleState(state: string) {
    this.losingDoubleState = state;
  }
  changeWinningTeam(team: string) {
    if (team === 'team1') {
      this.winningTeam = this.team1Name;
    }
    if (team === 'team2') {
      this.winningTeam = this.team2Name;
    }
  }
  changeLosingTeam(team: string) {
    if (team === 'team1') {
      this.losingTeam = this.team1Name;
    }
    if (team === 'team2') {
      this.losingTeam = this.team2Name;
    }
  }
  onAddScoresAndBonuses(modal: MDBModalRef, f: NgForm) {
    modal.hide();
    console.log(f);
    let winningTeam = f.value['winningTeam'];
    winningTeam === this.team1Name ? winningTeam = 'team1' : winningTeam = 'team2';
    const suit = f.value['suit'];
    const bet = +f.value['bet'];
    const wonBets = +f.value['wonBets'];
    const doubleState = f.value['doubleState'];
    let double = false;
    let doubleDouble = false;
    doubleState === 'doubleDouble' ? doubleDouble = true : doubleDouble = false;
    doubleState === 'double' ? double = true : double = false;
    const otherTeamVulnerable = f.value['otherTeamVulnerable'];
    this.gameService.addWin(winningTeam, suit, bet, wonBets, double, doubleDouble, otherTeamVulnerable);
    this.isDanger();
  }
  onAddLoss(modal: MDBModalRef, f: NgForm) {
    modal.hide();
    console.log(f);
    let losingTeam = f.value['losingTeam'];
    losingTeam === this.team1Name ? losingTeam = 'team1' : losingTeam = 'team2';
    const bet = +f.value['betL'];
    const wonBets = +f.value['wonBets'];
    const doubleState = f.value['losingDoubleState'];
    let double = false;
    let doubleDouble = false;
    doubleState === 'doubleDouble' ? doubleDouble = true : doubleDouble = false;
    doubleState === 'double' ? double = true : double = false;
    const losingTeamVulnerable = f.value['losingTeamVulnerable'];
    this.gameService.notWinPenalty(losingTeam, bet, wonBets, double, doubleDouble, losingTeamVulnerable);
  }

  isDanger() {
    this.gameService.isDanger('team1') ? this.team1Danger = true : this.team1Danger = false;
    this.gameService.isDanger('team2') ? this.team2Danger = true : this.team2Danger = false;
  }
  addGamesPlayed() {
    const game = this.game;
    this.isCheckingGame = true;
    setTimeout(() => {
      if (this.game === game && !this.isResetting) {
        this.gamesPlayed++;
        this.gameService.addGamePlayed(this.gamesPlayed);
        this.isCheckingGame = false;
      }
    }, 6000);
  }

  onAddBonus(fb: NgForm) {
    const team1ba = Number(fb.value['team1ba']);
    const team2ba = Number(fb.value['team2ba']);
    this.gameService.addBonus(team1ba, team2ba);
    this.isCheckingGame ? this.isCheckingGame = true : this.addGamesPlayed();
    fb.reset();
  }
  setTeamsNames(namesModal: MDBModalRef, team1Name: string, team2Name: string) {
    if (team1Name) {
      this.team1Name = team1Name;
      this.gameService.setTeamName('team1', team1Name);
    } else {
      this.team1Name = 'Team 1';
    }
    if (team2Name) {
      this.team2Name = team2Name;
      this.gameService.setTeamName('team2', team2Name);
    } else {
      this.team2Name = 'Team 2';
    }
    namesModal.hide();
  }
  onAddScore(fs: NgForm) {
    const team1sa = Number(fs.value['team1sa']);
    const team2sa = Number(fs.value['team2sa']);
    this.gameService.addScore(team1sa, team2sa);
    this.isDanger();
    this.isCheckingGame ? this.isCheckingGame = true : this.addGamesPlayed();
    fs.reset();
  }
  resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
      this.gameService.resetGame();
      this.team1Name = 'Team 1';
      this.team2Name = 'Team 2';
      this.team1Danger = false;
      this.team2Danger = false;
      this.gamesPlayed = 0;
      this.isResetting = true;
      this.suit = 'clubs';
      this.doubleState = 'none';
      this.losingDoubleState = 'none';
      this.winningTeam = '';
      this.losingTeam = '';
      this.otherTeamVulnerable = false;
      this.losingTeamVulnerable = false;
      setTimeout(() => this.isResetting = false, 6000);
    }
  }
  getTotal() {
    return this.gameService.total();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
