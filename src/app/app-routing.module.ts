import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './component/dashboard/dashboard.component';
import { MoviesComponent }      from './component/movies/movies.component';
import { MovieDetailComponent }  from './component/movie-detail/movie-detail.component';
import { PersonDetailComponent }  from './component/person-detail/person-detail.component';
import { ReleaseComponent }  from './component/release/release.component';

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
