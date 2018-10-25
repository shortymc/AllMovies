import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MyPaginator } from './component/my-paginator';
import { SharedModule } from './../../shared/shared.module';
import { MoviesComponent } from './component/movies/movies.component';

const childRoutes: Routes = [
  {
    path: '', component: MoviesComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    TranslateModule.forChild(),
    MatTableModule,
    LayoutModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [
    TranslateService,
    { provide: MatPaginatorIntl, useClass: MyPaginator, deps: [TranslateService] }
  ],
  declarations: [MoviesComponent]
})
export class MoviesModule { }
