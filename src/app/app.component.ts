import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.css'],
    template: `
	<div class="header">
		<h1>{{title}}</h1>
	   <nav>
		 <a routerLink="/dashboard">Dashboard</a>
		 <a routerLink="/movies">Movies</a>
		 <a routerLink="/release">Sorties</a>
	   </nav>
	</div>
   <router-outlet></router-outlet>
    `
})

export class AppComponent {
  title = 'Mon Appli';
}