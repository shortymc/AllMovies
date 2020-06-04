import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatExpansionModule } from '@angular/material/expansion';

import { SerieDetailComponent } from './serie-detail/serie-detail.component';
import { SeasonDetailComponent } from './season-detail/season-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { SeasonsComponent } from './seasons/seasons.component';

const childRoutes: Routes = [
  {
    path: ':id', component: SerieDetailComponent
  },
  {
    path: ':id/:season', component: SeasonDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule.forChild(),
    FontAwesomeModule,
    MatTableModule,
    MatExpansionModule,
    RouterModule.forChild(childRoutes),
  ],
  declarations: [
    SerieDetailComponent,
    SeasonsComponent,
    SeasonDetailComponent
  ],
  providers: []
})
export class SerieDetailModule { }
