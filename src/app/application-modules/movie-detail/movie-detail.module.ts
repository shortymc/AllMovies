import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MovieService } from './../../service/movie.service';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailComponent } from './component/movie-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';
import { OmdbService } from '../../service/omdb.service';

const childRoutes: Routes = [
  {
    path: ':id', component: MovieDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RatingModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  declarations: [MovieDetailComponent],
  providers: [MovieService, DropboxService, TranslateService, OmdbService]
})
export class MovieDetailModule { }
