import { Round } from './round';
import { Team } from './team';



export class Game {

    constructor(team1:Team, team2:Team) {
        this.team1 = team1;
        this.team2 = team2;
    }

    public team1:Team;
    public team2:Team;

    public match1:Round[];
    public match2:Round[];
    public match3:Round[];

}
