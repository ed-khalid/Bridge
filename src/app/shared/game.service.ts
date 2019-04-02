import { Subject } from 'rxjs';
import { Game } from './game.model';
import { Team } from './team.model';

export class GameService {
    gameChanged = new Subject<Game>();
    gamesChanged = new Subject<Game[]>();
    private games: Game[] = [];
    private game: Game = new Game(new Team('Team 1', [], [], 0), new Team('Team 2', [], [], 0), 0);

    addScore(team1score: number, team2score: number) {
        this.game.team1.score.push(team1score);
        let t1GameWonScore = 0;
        let t1GamesWon = 0;
        for (const num of this.game.team1.score) {
            t1GameWonScore = t1GameWonScore + num;
            if (t1GameWonScore >= 100) {
                t1GameWonScore = 0;
                t1GamesWon++;
            }
        }
        this.game.team1.gamesWon = t1GamesWon;
        this.game.team2.score.push(team2score);
        let t2GameWonScore = 0;
        let t2GamesWon = 0;
        for (const num of this.game.team2.score) {
            t2GameWonScore = t2GameWonScore + num;
            if (t2GameWonScore >= 100) {
                t2GameWonScore = 0;
                t2GamesWon++;
            }
        }
        this.game.team2.gamesWon = t2GamesWon;
        this.gameChanged.next(this.game);
    }
    addGamePlayed(gamesPlayed: number) {
        this.game.gamesPlayed = gamesPlayed;
        this.gameChanged.next(this.game);
    }
    setTeamName(team: string, teamName: string) {
        if (team === 'team1') {
            this.game.team1.name = teamName;
            this.gameChanged.next(this.game);
        }
        if (team === 'team2') {
            this.game.team2.name = teamName;
            this.gameChanged.next(this.game);
        }
    }
    getGame() {
        return this.game;
    }
    setGames(games: Game[]) {
        this.games = games;
    }
    resetGame() {
        this.games.push(this.game);
        this.gamesChanged.next(this.games.slice());
        this.game.team1.name = 'Team 1';
        this.game.team1.bonus = [];
        this.game.team1.score = [];
        this.game.team1.gamesWon = 0;
        this.game.team2.name = 'Team 2';
        this.game.team2.bonus = [];
        this.game.team2.score = [];
        this.game.team2.gamesWon = 0;
        this.game.gamesPlayed = 0;
        this.gameChanged.next(this.game);
    }
    getGames() {
        return this.games;
    }
    addBonus(team1bonus: number, team2bonus: number) {
        this.game.team1.bonus.push(team1bonus);
        this.game.team2.bonus.push(team2bonus);
        this.gameChanged.next(this.game);
    }
    isDanger(team: string) {
        if (team === 'team1') {
            const t1Score = this.total().t1Score;
            if (t1Score >= 100) {
                return true;
            }
        }
        if (team === 'team2') {
            const t2Score = this.total().t2Score;
            if (t2Score >= 100) {
                return true;
            }
        }
        return false;
    }
    total() {
        let team1Total = 0;
        let team2Total = 0;
        let team1Score = 0;
        let team2Score = 0;
        for (const num of this.game.team1.bonus) {
            team1Total = team1Total + num;
        }
        for (const num of this.game.team1.score) {
            team1Total = team1Total + num;
            team1Score = team1Score + num;
        }
        for (const num of this.game.team2.bonus) {
            team2Total = team2Total + num;
        }
        for (const num of this.game.team2.score) {
            team2Total = team2Total + num;
            team2Score = team2Score + num;
        }
        return {team1: team1Total, team2: team2Total, t1Score: team1Score, t2Score: team2Score};
    }
    // totalsOfGame(game: Game) {
    //     let team1Total = 0;
    //     let team2Total = 0;
    //     let team1Score = 0;
    //     let team2Score = 0;
    //     for (const num of game.team1.bonus) {
    //         team1Total = team1Total + num;
    //     }
    //     for (const num of game.team1.score) {
    //         team1Total = team1Total + num;
    //         team1Score = team1Score + num;
    //     }
    //     for (const num of game.team2.bonus) {
    //         team2Total = team2Total + num;
    //     }
    //     for (const num of game.team2.score) {
    //         team2Total = team2Total + num;
    //         team2Score = team2Score + num;
    //     }
    //     return {team1: team1Total, team2: team2Total, t1Score: team1Score, t2Score: team2Score};
    // }
}
