import { PersonSearchService } from './../dashboard/service/person-search.service';
import { ConvertToHHmmPipe } from './../../shared/custom.pipe';
import { MyPaginator } from './../movies/component/my-paginator';
import { NgModule } from '@angular/core';
import { DiscoverComponent } from './component/discover.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropboxService } from './../../service/dropbox.service';
import { MovieService } from './../../service/movie.service';
import { SharedModule } from './../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NouisliderModule } from 'ng2-nouislider';
import {
  MatListModule, MatIconModule, MatButtonToggleModule, MatSelectModule,
  MatFormFieldModule, MatPaginatorModule, MatPaginatorIntl, MatInputModule, MatAutocompleteModule
} from '@angular/material';

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
    SharedModule,
    TranslateModule.forChild(),
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    NouisliderModule,
    MatFormFieldModule,
    MatButtonToggleModule
  ],
  providers: [
    MovieService,
    DropboxService,
    TranslateService,
    ConvertToHHmmPipe,
    PersonSearchService,
    { provide: MatPaginatorIntl, useClass: MyPaginator, deps: [TranslateService] }],
  declarations: [DiscoverComponent]
})
export class DiscoverModule { }
