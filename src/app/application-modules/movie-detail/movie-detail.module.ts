import { MovieService } from './../../service/movie.service';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailComponent } from './component/movie-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';

const childRoutes: Routes = [
  {
    path: ':id', component: MovieDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
    RatingModule,
  ],
  declarations: [MovieDetailComponent],
  providers: [MovieService, DropboxService]
})
export class MovieDetailModule { }
