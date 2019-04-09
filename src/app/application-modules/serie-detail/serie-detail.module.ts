import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SerieDetailComponent } from './component/serie-detail.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: ':id', component: SerieDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule.forChild(),
    FontAwesomeModule,
    MatTableModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  exports: [SerieDetailComponent],
  declarations: [SerieDetailComponent],
  providers: [
    TranslateService
  ]
})
export class SerieDetailModule { }
