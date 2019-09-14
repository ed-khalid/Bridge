import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Player } from 'src/app/model/player';
import { Observable } from 'rxjs';



@Component({
    selector: 'app-home'
    ,templateUrl: './home.component.html'
    ,styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public players$:Observable<Player[]>;
    public showSelectPlayers:Boolean = false;

    constructor(private db:AngularFirestore) {

    }

    ngOnInit() {
        this.players$ = this.db.collection<Player>('players').valueChanges();
    }



    public selectPlayers() {
        this.showSelectPlayers = true;
    }

}

