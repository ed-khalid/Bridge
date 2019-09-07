import { Player } from './player';


export class Team {

    public player1:Player;
    public player2:Player;
    public date:Date;

    constructor(player1:Player, player2:Player) {

        this.player1 = player1;
        this.player2 = player2;
        this.date = new Date();
    }




}
