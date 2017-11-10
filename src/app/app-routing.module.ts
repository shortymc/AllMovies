import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard.component';
import { MoviesComponent }      from './movies.component';
import { MovieDetailComponent }  from './movie-detail.component';
import { PersonDetailComponent }  from './person-detail.component';
import { ReleaseComponent }  from './release.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:id', component: MovieDetailComponent },
  { path: 'person/:id', component: PersonDetailComponent },
  { path: 'release', component: ReleaseComponent },
  { path: 'movies',     component: MoviesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}