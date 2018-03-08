import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './application-modules/dashboard/dashboard.module#DashboardModule'},
  { path: 'movie', loadChildren: './application-modules/movie-detail/movie-detail.module#MovieDetailModule'},
  { path: 'person', loadChildren: './application-modules/person-detail/person-detail.module#PersonDetailModule'},
  { path: 'release', loadChildren: './application-modules/release/release.module#ReleaseModule'},
  { path: 'movies', loadChildren: './application-modules/movies/movies.module#MoviesModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
