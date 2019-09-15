import { Player } from './player';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';


export class Team {

    public player1:Player;
    public player2:Player;
    public afs:QueryDocumentSnapshot<Team>; 


    constructor(afs?:QueryDocumentSnapshot<Team>) {
        if (afs) {
            this.afs = afs;
            const team = this.afs.data();
            this.player1 = team.player1; 
            this.player2 = team.player2; 
        }
    }
    


    get players(): Player[] {
        return [this.player1, this.player2].filter(Boolean);
    }

    add(player:Player) {
        if ( this.player1 === player || this.player2 === player) {
           return false;
        }
        if (!this.player1) {
            this.player1 = player;
            return true;
        }
        if (!this.player2) {
            this.player2 = player;
            return true;
        }
        return false;
    }

    remove(player:Player) {
        if (this.player1 === player) {
            this.player1 = null;
        }
        if (this.player2 === player) {
            this.player2 = null;
        }

    }

}
