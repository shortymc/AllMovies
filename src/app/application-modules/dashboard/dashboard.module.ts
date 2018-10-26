import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const childRoutes: Routes = [
  {
    path: '', component: DashboardComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    TranslateModule.forChild(),
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    TranslateService,
  ]
})
export class DashboardModule { }
