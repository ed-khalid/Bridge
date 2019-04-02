import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameStorageService } from './shared/game-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'BridgeStats';
  uniqueId = '';
  constructor(private gameStorage: GameStorageService) {}

  ngOnInit() {
    this.uniqueId = this.generateId();
    console.log(this.uniqueId);
    this.gameStorage.init(this.uniqueId);
  }
  ngOnDestroy() {
    this.gameStorage.destroy();
  }
  generateId() {
    const id = Math.random().toString(36).substr(2, 9);
    return id;
  }
}
