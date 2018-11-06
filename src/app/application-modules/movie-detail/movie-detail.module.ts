import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  SwiperModule,
  SWIPER_CONFIG
} from 'ngx-swiper-wrapper';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { MovieDetailComponent } from './component/movie-detail.component';
import { SharedModule } from '../../shared/shared.module';

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
    RatingModule,
    SwiperModule,
    PinchZoomModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  declarations: [MovieDetailComponent],
  providers: [
    TranslateService,
    {
      provide: SWIPER_CONFIG,
      useValue: {}
    }
  ]
})
export class MovieDetailModule { }
