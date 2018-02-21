import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyNgbDate } from './../../shared/my-ngb-date';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseComponent } from './component/release.component';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: '', component: ReleaseComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
    RatingModule,
    NgbModule
  ],
  providers: [
    MyNgbDate
  ],
  declarations: [ReleaseComponent]
})
export class ReleaseModule { }
