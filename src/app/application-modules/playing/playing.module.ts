import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MyPaginator } from './../movies/component/my-paginator';
import { PlayingComponent } from './component/playing.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: '', component: PlayingComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    MatListModule,
    FontAwesomeModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
  declarations: [PlayingComponent],
  providers: [TranslateService,
    { provide: MatPaginatorIntl, useClass: MyPaginator, deps: [TranslateService] }]
})
export class PlayingModule { }
