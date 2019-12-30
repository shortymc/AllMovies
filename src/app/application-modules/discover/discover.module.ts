import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NouisliderModule } from 'ng2-nouislider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SearchBoxComponent } from './component/search-box/search-box.component';
import { MyPaginator } from './../../shared/my-paginator';
import { DiscoverComponent } from './component/discover.component';
import { SharedModule } from './../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: '', component: DiscoverComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule.forChild(),
    TranslateModule.forChild(),
    MatListModule,
    FontAwesomeModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    NouisliderModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonToggleModule
  ],
  providers: [
    TranslateService,
    {
      provide: MatPaginatorIntl, useFactory: (translate: TranslateService): MyPaginator => new MyPaginator(translate, 'datas'),
      deps: [TranslateService]
    }
  ],
  declarations: [DiscoverComponent, SearchBoxComponent]
})
export class DiscoverModule { }
