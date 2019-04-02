import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  onSignup(f: NgForm) {
    const name = f.value['fname'];
    const email = f.value['email'];
    const password = f.value['password'];
    this.authService.createUser(name, email, password);
    f.reset();
  }

}
