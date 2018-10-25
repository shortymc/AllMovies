import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PersonDetailComponent } from './component/person-detail.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: ':id', component: PersonDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule.forChild(),
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  declarations: [PersonDetailComponent],
  providers: [
    TranslateService,
  ]
})
export class PersonDetailModule { }
