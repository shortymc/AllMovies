import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MovieDetailComponent } from './component/movie-detail/movie-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { ListsComponent } from './component/lists/lists.component';

const childRoutes: Routes = [
  {
    path: ':id', component: MovieDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule.forChild(),
    FontAwesomeModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  exports: [MovieDetailComponent],
  declarations: [MovieDetailComponent, ListsComponent],
  providers: [
    TranslateService
  ]
})
export class MovieDetailModule { }
