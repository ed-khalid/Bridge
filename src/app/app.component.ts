import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameStorageService } from './shared/game-storage.service';
import { AuthService } from './auth/auth.service';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'BridgeStats';
  uniqueId = '';
  constructor(private gameStorage: GameStorageService, private authService: AuthService) {}

  ngOnInit() {
    this.uniqueId = this.generateId();
    console.log(this.uniqueId);
    this.gameStorage.init(this.uniqueId);
    firebase.initializeApp(environment.firebaseConfig);
    this.authService.loadUser();
  }
  ngOnDestroy() {
    this.gameStorage.destroy();
  }
  generateId() {
    const id = Math.random().toString(36).substr(2, 9);
    return id;
  }
}
