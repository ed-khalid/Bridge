import { Component, OnInit } from '@angular/core';
import { GameStorageService } from 'src/app/shared/game-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  displayName = null;
  constructor(private gameStorage: GameStorageService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
  checkAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.displayName = this.authService.displayName;
      return false;
    } else {
      this.displayName = null;
      return true;
    }
  }
  onLogout() {
    this.authService.logout();
  }

}
