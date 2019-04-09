import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGard } from './app.gards';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './application-modules/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGard] },
  { path: 'movie', loadChildren: './application-modules/movie-detail/movie-detail.module#MovieDetailModule', canActivate: [AuthGard] },
  { path: 'serie', loadChildren: './application-modules/serie-detail/serie-detail.module#SerieDetailModule', canActivate: [AuthGard] },
  { path: 'person', loadChildren: './application-modules/person-detail/person-detail.module#PersonDetailModule', canActivate: [AuthGard] },
  { path: 'release', loadChildren: './application-modules/release/release.module#ReleaseModule', canActivate: [AuthGard] },
  { path: 'movies', loadChildren: './application-modules/movies/movies.module#MoviesModule', canActivate: [AuthGard] },
  { path: 'discover', loadChildren: './application-modules/discover/discover.module#DiscoverModule', canActivate: [AuthGard] },
  { path: 'tags', loadChildren: './application-modules/tags/tags.module#TagsModule', canActivate: [AuthGard] },
  { path: 'login', loadChildren: './application-modules/login/login.module#LoginModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
