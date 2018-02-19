import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
	<div class="header">
    <nav>
      <button class="btn btn-outline-primary" routerLink="/dashboard">Dashboard</button>
      <button class="btn btn-outline-primary" routerLink="/movies">Movies</button>
      <button class="btn btn-outline-primary" routerLink="/release">Sorties</button>
    </nav>
  </div>
  <router-outlet></router-outlet>
    `
})

export class AppComponent {
}
