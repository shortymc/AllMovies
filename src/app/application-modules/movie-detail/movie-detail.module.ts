import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatListModule, MatPaginatorModule, MatSelectModule, MatPaginatorIntl, MatButtonToggleModule, MatCheckboxModule } from '@angular/material';

import { MovieDetailComponent } from './component/movie-detail/movie-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { ListsComponent } from './component/lists/lists.component';
import { ListDetailComponent } from './component/list-detail/list-detail.component';
import { MyPaginator } from '../../shared/my-paginator';

const childRoutes: Routes = [
  { path: ':id', component: MovieDetailComponent },
  { path: 'list/:id', component: ListDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule.forChild(),
    FontAwesomeModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
    MatListModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  exports: [MovieDetailComponent],
  declarations: [MovieDetailComponent, ListsComponent, ListDetailComponent],
  providers: [
    TranslateService,
    {
      provide: MatPaginatorIntl, useFactory: (translate: TranslateService): MyPaginator => new MyPaginator(translate, 'datas'),
      deps: [TranslateService]
    }
  ]
})
export class MovieDetailModule { }
