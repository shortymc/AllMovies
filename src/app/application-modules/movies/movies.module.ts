import { DropboxService } from './../../service/dropbox.service';
import { MovieService } from './../../service/movie.service';
import { SharedModule } from './../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './component/movies/movies.component';

const childRoutes: Routes = [
  {
    path: '', component: MoviesComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
  ],
  providers: [
    MovieService,
    DropboxService
  ],
  declarations: [MoviesComponent]
})
export class MoviesModule { }
