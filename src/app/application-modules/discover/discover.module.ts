import { TitleService } from './../../service/title.service';
import { CertificationService } from './../../service/certification.service';
import { GenreService } from './../../service/genre.service';
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
  MatFormFieldModule, MatPaginatorModule, MatPaginatorIntl, MatInputModule, MatAutocompleteModule, MatChipsModule, MatSlideToggleModule
} from '@angular/material';
import { SearchBoxComponent } from './component/search-box/search-box.component';
import { PersonSearchService } from '../../service/person-search.service';
import { KeywordSearchService } from '../../service/keyword-search.service';

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
    MatSlideToggleModule,
    MatSelectModule,
    NouisliderModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonToggleModule
  ],
  providers: [
    MovieService,
    DropboxService,
    TranslateService,
    PersonSearchService,
    KeywordSearchService,
    CertificationService,
    TitleService,
    GenreService,
    { provide: MatPaginatorIntl, useClass: MyPaginator, deps: [TranslateService] }],
  declarations: [DiscoverComponent, SearchBoxComponent]
})
export class DiscoverModule { }
