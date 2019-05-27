import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameService } from './game.service';
import { Subscription } from 'rxjs';
import { Game } from './game.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GameStorageService {
    constructor(private http: HttpClient, private gameService: GameService, private authService: AuthService) { }
    gamesSubscription: Subscription;
    currentGameSubscription: Subscription;
    uniqueId = '';
    currentGameId = '';
    init(uniqueId: string) {
        this.uniqueId = uniqueId;
        this.gamesSubscription = this.gameService.gamesChanged.subscribe((games: Game[]) => {
            this.http.post('https://bridge-s.firebaseio.com/guest-games/' + uniqueId + '.json', games[games.length - 1]).subscribe(
                (res: Response) => {
                    console.log(res);
                    this.getGuestHistory();
                },
                (error) => console.log(error)
            );
        });
        this.http.post('https://bridge-s.firebaseio.com/guest-games/' + uniqueId + '.json', this.gameService.getGame()).subscribe(
            (res: Response) => {
                if (res) {
                    this.currentGameId = Object.values(res)[0];
                    console.log(this.currentGameId);
                }
            },
            (error) => console.log(error)
        );
        this.currentGameSubscription = this.gameService.gameChanged.subscribe((game: Game) => {
            this.http.put('https://bridge-s.firebaseio.com/guest-games/' + uniqueId + '/' + this.currentGameId + '.json', game).subscribe(
                (res: Response) => {
                    console.log(res);
                },
                (error) => console.log(error)
            );
        });
        console.log('init');
    }
    getGuestHistory() {
        if (this.authService.isAuthenticated()) {
            this.getHistory();
        } else {
            console.log('not authenticated!');
            this.http.get('https://bridge-s.firebaseio.com/guest-games/' + this.uniqueId + '.json').subscribe(
                (games) => {
                    const newGames: Game[] = [];
                    if (games) {
                        Object.values(games).forEach((value: Game) => newGames.push(value));
                        this.gameService.setGames(newGames);
                    }
                    return newGames;
                },
                (error) => console.log(error)
            );
        }
    }
    getHistory() {
        this.http.get('https://bridge-s.firebaseio.com/guest-games.json?auth=' + this.authService.getToken()).subscribe(
            (uniqueIds) => {
                const newGames: Game[] = [];
                if (uniqueIds) {
                    Object.values(uniqueIds).forEach((games) => {
                        if (games) {
                            Object.values(games).forEach((game: Game) => {
                                newGames.push(game);
                            });
                            this.gameService.setGames(newGames);
                        }
                    });
                }
                return newGames;
            },
            (error) => console.log(error)
        );
    }
    destroy() {
        this.gamesSubscription.unsubscribe();
    }
    putGame() {
        const game = this.gameService.getGame();
        return this.http.put('https://bridge-s.firebaseio.com/games-guest/game.json', game).subscribe(
            (res: Response) => {
                console.log(res);
            },
            (error) => console.log(error)
        );
    }
}
