import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Player } from 'src/app/model/player';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/model/team';
import { Game } from 'src/app/model/game';



@Component({
    selector: 'app-home'
    ,templateUrl: './home.component.html'
    ,styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public players$:Observable<Player[]>;
    public playersRef:AngularFirestoreCollection; 
    public playerRefs:any[];
    public showSelectPlayers:Boolean = false;

    public team1:Team = new Team();
    public team2:Team = new Team();


    constructor(private db:AngularFirestore) {

    }

    ngOnInit() {
        this.playersRef = this.db.collection<Player>('players');
        this.players$ = this.db.collection<Player>('players').valueChanges()
        this.playersRef.snapshotChanges().pipe(map(actions => 
          actions.map(action => ({ id: action.payload.doc.id  , ...action.payload.doc.data() }) )
        )).subscribe( players => this.playerRefs = players )
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

    public areTeamsFull() {
        return this.team1.players.concat(this.team2.players).length === 4;
    }

    public startGame() {

        this.getTeam(this.team1);

        // const game:Game = new Game(this.team1, this.team2);
        // const _game = JSON.parse(JSON.stringify(game));
        // this.db.collection<Game>('games').add(_game).then(done => {
        //     console.log('Game added!');
        // });
    }


    public getTeam(team:Team)  {



        // order team players alphabetically
        const sorted =  Object.assign([],team.players).sort((a,b) => a.name.localeCompare(b.name))
        const player1 = sorted[0];
        const player2 = sorted[1];
        const p1  = this.playerRefs.find(it => it.name === player1.name );
        const p2 = this.playerRefs.find(it => it.name === player2.name );

        const p1Ref = this.playersRef.doc(p1.id);
        const p2Ref = this.playersRef.doc(p2.id);

        const ref = this.db.collection('teams').ref
        ref.where('player1', '==', p1Ref )
        ref.where('player2', '==', p2Ref).get().then(result => {
            console.log(result);
        });

    }


}

