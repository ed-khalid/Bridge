import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'history', children: [
    { path: '', component: HistoryComponent },
    { path: 'guest', component: HistoryComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
