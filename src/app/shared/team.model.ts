export class Team {
    public name: string;
    public bonus: Array<number>;
    public score: Array<number>;
    public gamesWon: number;
    constructor(name: string, bonus: Array<number>, score: Array<number>, gamesWon: number) {
        this.name = name;
        this.bonus = bonus;
        this.score = score;
        this.gamesWon = gamesWon;
    }
}
