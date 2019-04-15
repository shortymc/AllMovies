import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LayoutModule } from '@angular/cdk/layout';
import { MatAutocompleteModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from 'ngx-color-picker';

import { SearchMovieComponent } from './components/search-movie/search-movie.component';
import { TagsComponent } from './components/tags/tags.component';
import { SharedModule } from './../../shared/shared.module';
// import { MyPaginator } from '../movies/component/my-paginator';
import { TagMoviesComponent } from './components/tag-movies/tag-movies.component';

const childRoutes: Routes = [
  {
    path: '', component: TagsComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    TranslateModule.forChild(),
    FontAwesomeModule,
    MatTableModule,
    LayoutModule,
    ColorPickerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  declarations: [TagsComponent, TagMoviesComponent, SearchMovieComponent],
  providers: [
    TranslateService,
    // {
    //   provide: MatPaginatorIntl, useFactory: (translate: TranslateService): MyPaginator => new MyPaginator(translate, 'tags'),
    //   deps: [TranslateService]
    // }
  ]
})
export class TagsModule { }
