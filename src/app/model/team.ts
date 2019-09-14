import { Player } from './player';


export class Team {

    public player1:Player;
    public player2:Player;


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
