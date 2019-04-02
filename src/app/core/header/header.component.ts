import { Component, OnInit } from '@angular/core';
import { GameStorageService } from 'src/app/shared/game-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(private gameStorage: GameStorageService, private router: Router) { }

  ngOnInit() {
  }
  test() {
    this.gameStorage.putGame();
  }

}
