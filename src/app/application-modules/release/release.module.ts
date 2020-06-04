import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyNgbDate } from './../../shared/my-ngb-date';
import { ReleaseComponent } from './component/release.component';
import { SharedModule } from '../../shared/shared.module';
import { MovieDetailModule } from '../movie-detail/movie-detail.module';

const childRoutes: Routes = [
  {
    path: '', component: ReleaseComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    MovieDetailModule,
  ],
  providers: [
    MyNgbDate,
    DatePipe,
  ],
  declarations: [ReleaseComponent],
})
export class ReleaseModule { }
