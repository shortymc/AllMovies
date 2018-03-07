import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropboxService } from './../../service/dropbox.service';
import { MovieService } from './../../service/movie.service';
import { SharedModule } from './../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './component/movies/movies.component';
import { MatTableModule } from '@angular/material/table';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSortModule } from '@angular/material/sort';

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
    TranslateModule.forChild(),
    MatTableModule,
    LayoutModule,
    MatSortModule
  ],
  providers: [
    MovieService,
    DropboxService,
    TranslateService
  ],
  declarations: [MoviesComponent]
})
export class MoviesModule { }
