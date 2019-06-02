import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = null;
  displayName = null;
  email = null;
  uid = null;
  tokenChanged = new Subject<string>();

  constructor(private router: Router) { }
  createUser(name: string, email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      (res) => {
        console.log(res);
        firebase.auth().currentUser.updateProfile(
          {
            displayName: name
          }
        ).then(() => {
          console.log('User created!');
          console.log('display name updated!');
          this.displayName = firebase.auth().currentUser.displayName;
          this.email = firebase.auth().currentUser.email;
          firebase.auth().currentUser.getIdToken().then((token: string) => this.token = token);
          this.uid = firebase.auth().currentUser.uid;
          this.router.navigate(['/']);
        }, (reason) => console.log(reason));
      },
      (reason) => console.log(reason)
    );
  }
  loginUser(email: string, pwd: string) {
    firebase.auth().signInWithEmailAndPassword(email, pwd).then(
      () => {
        console.log('success!');
        this.displayName = firebase.auth().currentUser.displayName;
        this.email = firebase.auth().currentUser.email;
        this.uid = firebase.auth().currentUser.uid;
        this.router.navigate(['/']);
        firebase.auth().currentUser.getIdToken().then(
          (token: string) => this.token = token
        );
      },
      (reason) => console.log(reason)
    );
  }
  getToken() {
    firebase.auth().currentUser.getIdToken().then(
      (token: string) => this.token = token
    );
    return this.token;
  }
  isAuthenticated() {
    return this.token != null;
  }
  logout() {
    firebase.auth().signOut();
    this.token = null;
    this.displayName = null;
    this.email = null;
    this.uid = null;
    this.router.navigate(['/']);
  }
  loadUser() {
    firebase.auth().onAuthStateChanged(
      (currentUser) => {
        // console.log(currentUser);
        if (currentUser === null) {
          this.displayName = null;
          this.email = null;
          this.token = null;
          this.uid = null;
          console.log('not logged in!');
        } else {
          currentUser.getIdToken().then((token: string) => this.token = token);
          this.displayName = currentUser.displayName;
          this.email = currentUser.email;
          this.uid = currentUser.uid;
          this.tokenChanged.next(this.token);
          console.log('logged in!');
        }
      }
    );
  }
}
