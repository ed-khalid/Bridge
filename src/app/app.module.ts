import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { MainComponent } from './core/main/main.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { GameService } from './shared/game.service';
import { FormsModule } from '@angular/forms';
import { GameStorageService } from './shared/game-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { HistoryComponent } from './history/history.component';
import { GameItemComponent } from './history/game-item/game-item.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './auth/auth.service';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    HistoryComponent,
    GameItemComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MDBBootstrapModule.forRoot(),
    Ng5SliderModule,
    HttpClientModule
  ],
  providers: [GameService, GameStorageService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
