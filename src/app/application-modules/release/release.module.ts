import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MyNgbDate } from './../../shared/my-ngb-date';
import { ReleaseComponent } from './component/release.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: '', component: ReleaseComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    RatingModule,
    TranslateModule.forChild(),
  ],
  providers: [
    MyNgbDate,
    DatePipe,
    TranslateService,
  ],
  declarations: [ReleaseComponent],
})
export class ReleaseModule { }
