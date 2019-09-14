import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Player } from 'src/app/model/player';
import { Observable } from 'rxjs';
import { Team } from 'src/app/model/team';



@Component({
    selector: 'app-home'
    ,templateUrl: './home.component.html'
    ,styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public players$:Observable<Player[]>;
    public showSelectPlayers:Boolean = false;

    public team1:Team = new Team();
    public team2:Team = new Team();


    constructor(private db:AngularFirestore) {

    }

    ngOnInit() {
        this.players$ = this.db.collection<Player>('players').valueChanges();
    }



    public addToTeam(player:Player) {

        // move to team 2
        if (this.team1.players.includes(player)) {
            this.team1.remove(player);
            this.team2.add(player);
        // move to bench
        } else if (this.team2.players.includes(player)) {
            this.team2.remove(player);
        } else {
            // add a fresh new player
            if (!this.team1.player1) {
            this.team1.player1 = player;
            } else if (!this.team1.player2) {
            this.team1.player2 = player;
            } else if (!this.team2.player1) {
            this.team2.player1 = player;
            } else if (!this.team2.player2) {
            this.team2.player2 = player;
            }
        }

    }

    public removePlayer(player:Player, team:Team) {
        if (team.player1 === player) {
            team.player1 = null;
        } else if (team.player2 === player) {
            team.player2 = null;
        }
    }


    public selectPlayers() {
        this.showSelectPlayers = true;
    }

}

