import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonSearchComponent } from './component/person-search/person-search.component';
import { MovieSearchComponent } from './component/movie-search/movie-search.component';
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
    MovieSearchComponent,
    PersonSearchComponent],
  providers: [
    TranslateService,
  ]
})
export class DashboardModule { }
