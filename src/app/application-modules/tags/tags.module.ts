import { TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LayoutModule } from '@angular/cdk/layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from 'ngx-color-picker';

import { SearchDataComponent } from './components/search-data/search-data.component';
import { TagsComponent } from './components/tags/tags.component';
import { SharedModule } from './../../shared/shared.module';
import { MyPaginator } from '../../shared/my-paginator';
import { TagDatasComponent } from './components/tag-datas/tag-datas.component';

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
    FontAwesomeModule,
    MatTableModule,
    LayoutModule,
    ColorPickerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  declarations: [
    TagsComponent,
    TagDatasComponent,
    SearchDataComponent
  ],
  providers: [
    TranslateService,
    {
      provide: MatPaginatorIntl, useFactory: (translate: TranslateService): MyPaginator => new MyPaginator(translate, 'tags'),
      deps: [TranslateService]
    }
  ]
})
export class TagsModule { }
