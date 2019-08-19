import { Subject } from 'rxjs';
import { Game } from './game.model';
import { Team } from './team.model';

export class GameService {
    gameChanged = new Subject<Game>();
    gamesChanged = new Subject<Game[]>();
    private games: Game[] = [];
    private game: Game = new Game(new Team('Team 1', [], [], 0), new Team('Team 2', [], [], 0), 0, new Date(Date.now()));

    addScore(team1score: number, team2score: number) {
        this.game.team1.score.push(team1score);
        this.game.team2.score.push(team2score);
        // games won check
        let team1winScore = 0;
        let team2winScore = 0;
        let t1GamesWon = 0;
        let t2GamesWon = 0;
        this.game.team1.score.forEach((score, index) => {
            team1winScore += score;
            team2winScore += this.game.team2.score[index];
            if (team1winScore >= 100) {
                t1GamesWon += 1;
                team1winScore = 0;
                team2winScore = 0;
            } else if (team2winScore >= 100) {
                t2GamesWon += 1;
                team1winScore = 0;
                team2winScore = 0;
            }
        });
        this.game.team1.gamesWon = t1GamesWon;
        this.game.team2.gamesWon = t2GamesWon;
        this.gameChanged.next(this.game);
    }
    addWin(team = 'team1', suit = 'clubs', bet = 7, wonStrikes = 7, double = false, doubleDouble = false, vulnerable = false) {
        // below the line score
        let score = 0;
        if (doubleDouble && double) {
            if (suit === 'nt') {
                score = 160 + ((bet - 7) * 120);
            }
            if (suit === 'spades' || suit === 'hearts') {
                score = 120 + ((bet - 7) * 120);
            }
            if (suit === 'clubs' || suit === 'diamonds') {
                score = 80 + ((bet - 7) * 80);
            }
        }
        if (double === true && doubleDouble === false) {
            if (suit === 'nt') {
                score = 80 + ((bet - 7) * 60);
            }
            if (suit === 'spades' || suit === 'hearts') {
                score = 60 + ((bet - 7) * 60);
            }
            if (suit === 'clubs' || suit === 'diamonds') {
                score = 40 + ((bet - 7) * 40);
            }
        }
        if (double === false) {
            if (suit === 'nt') {
                score = 40 + ((bet - 7) * 30);
            }
            if (suit === 'spades' || suit === 'hearts') {
                score = 30 + ((bet - 7) * 30);
            }
            if (suit === 'clubs' || suit === 'diamonds') {
                score = 20 + ((bet - 7) * 20);
            }
        }
        // above the line
        let bonus = 0;
        if ((wonStrikes - bet) > 0) {
            if (doubleDouble && vulnerable) {
                bonus = 400 + 100; // doubleDouble bonus 100
            }
            if (doubleDouble && vulnerable === false) {
                bonus = 200 + 100; // doubleDouble bonus 100
            }
            if (double && doubleDouble === false && vulnerable) {
                bonus = 200 + 50; // double bonus 50
            }
            if (double && doubleDouble === false && vulnerable === false) {
                bonus = 100 + 50; // double bonus 50
            }
            if (double === false) {
                if (suit === 'nt' || suit === 'spades' || suit === 'hearts') {
                    bonus = ((wonStrikes - bet) * 30);
                }
                if (suit === 'clubs' || suit === 'diamonds') {
                    bonus = ((wonStrikes - bet) * 20);
                }
            }
        } else {
            if (doubleDouble) {
                bonus = 100;
            }
            if (double) {
                bonus = 50;
            }
        }
        // adding scores and bonuses
        if (team === 'team1') {
            this.addScore(score, 0);
            this.addBonus(bonus, 0);
        } else {
            this.addScore(0, score);
            this.addBonus(0, bonus);
        }
        this.addGamePlayed(this.game.gamesPlayed + 1);
    }
    notWinPenalty(lostTeam = 'team1', bet = 7, losingTeamStrikes = 5, double = false, doubleDouble = false, vulnerable = false) {
        // above the line
        let bonus = 0;
        const lostStrikes = bet - losingTeamStrikes;
        if (vulnerable && doubleDouble) {
            if (lostStrikes === 1) {
                bonus = 400;
            }
            if (lostStrikes === 2) {
                bonus = 600 + 400;
            }
            if (lostStrikes === 3) {
                bonus = 600 + 600 + 400;
            }
            if (lostStrikes > 3) {
                bonus = 1600 + (600 * (lostStrikes - 3));
            }
        }
        if (vulnerable && doubleDouble === false && double) {
            if (lostStrikes === 1) {
                bonus = 200;
            }
            if (lostStrikes === 2) {
                bonus = 300 + 200;
            }
            if (lostStrikes === 3) {
                bonus = 300 + 300 + 200;
            }
            if (lostStrikes > 3) {
                bonus = 800 + (300 * (lostStrikes - 3));
            }
        }
        if (vulnerable && double === false && doubleDouble === false) {
            bonus = 100 * lostStrikes;
        }
        if (vulnerable === false && doubleDouble) {
            if (lostStrikes === 1) {
                bonus = 200;
            }
            if (lostStrikes === 2) {
                bonus = 400 + 200;
            }
            if (lostStrikes === 3) {
                bonus = 400 + 400 + 200;
            }
            if (lostStrikes > 3) {
                bonus = 1000 + (600 * (lostStrikes - 3));
            }
        }
        if (vulnerable === false && doubleDouble === false && double) {
            if (lostStrikes === 1) {
                bonus = 100;
            }
            if (lostStrikes === 2) {
                bonus = 200 + 100;
            }
            if (lostStrikes === 3) {
                bonus = 200 + 200 + 100;
            }
            if (lostStrikes > 3) {
                bonus = 500 + (300 * (lostStrikes - 3));
            }
        }
        if (vulnerable === false && doubleDouble === false && double === false) {
            bonus = 50 * lostStrikes;
        }
        // adding bonuses
        if (lostTeam === 'team1') {
            this.addBonus(0, bonus);
        } else {
            this.addBonus(bonus, 0);
        }
        this.addGamePlayed(this.game.gamesPlayed + 1);
    }
    addGamePlayed(gamesPlayed: number) {
        this.game.gamesPlayed = gamesPlayed;
        this.game.datePlayed = new Date(Date.now());
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
        this.game.datePlayed = new Date(Date.now());
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
        this.game.team1.bonus.forEach((bonus) => team1Total += bonus);
        this.game.team1.score.forEach((game) => {
            team1Total += game;
            team1Score += game;
        });
        this.game.team2.bonus.forEach((bonus) => team2Total += bonus);
        this.game.team2.score.forEach((game) => {
            team2Total += game;
            team2Score += game;
        });
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
