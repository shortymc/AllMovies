import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MoviesComponent } from './component/movies/movies.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'movie', loadChildren: './application-modules/movie-detail/movie-detail.module#MovieDetailModule'},
  { path: 'person', loadChildren: './application-modules/person-detail/person-detail.module#PersonDetailModule'},
  { path: 'release', loadChildren: './application-modules/release/release.module#ReleaseModule'},
  { path: 'movies', component: MoviesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
