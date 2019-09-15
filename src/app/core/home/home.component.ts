import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Player } from 'src/app/model/player';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/model/team';



@Component({
    selector: 'app-home'
    ,templateUrl: './home.component.html'
    ,styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public players$:Observable<Player[]>;

    public team1:Team = new Team();
    public team2:Team = new Team();


    constructor(private db:AngularFirestore) {

    }

    ngOnInit() {
        this.players$ = this.db.collection<Player>('players').valueChanges({idField: 'id' })
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


    public createGame(team1:Team, team2:Team) {
        return this.db.collection('games').add({ team1 , team2  })
    }

    public startGame() {

        this.getTeam(this.team1).subscribe(team1 => {
            console.log(team1);
            this.getTeam(this.team2).subscribe(team2 => {
                this.createGame(team1, team2).then(gameCreated => {
                    console.log(gameCreated);
                });
            })
        });
    }


    public getTeam(team:Team) : Observable<Team>  {

        // order team players alphabetically
        const sorted =  Object.assign([],team.players).sort((a,b) => a.name.localeCompare(b.name))
        const player1 = sorted[0];
        const player2 = sorted[1];

        const p1Ref = this.db.doc(`players/${player1.id}`).ref; 
        const p2Ref = this.db.doc(`players/${player2.id}`).ref; 

        return this.db.collection<Team>('teams',  
               q => q.where('player1', '==', p1Ref
                    ).where('player2', '==', p2Ref) 
               )
               .get().pipe(map((result:QuerySnapshot<Team>) => {
                    if(result.docs.length) {
                        return new Team(result.docs[0]); 
                    } else {
                    this.db.collection('teams').add({
                        player1: p1Ref 
                        ,player2: p2Ref
                    }).then(newTeam => {
                        return of(newTeam);
                    })
                }
            }
        ))

    }


}

