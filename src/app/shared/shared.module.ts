import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {SwiperModule, SWIPER_CONFIG} from 'ngx-swiper-wrapper';
import {PinchZoomModule} from 'ngx-pinch-zoom';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

import {LangService} from './service/lang.service';
import {MetaComponent} from './components/meta/component/meta.component';
import {MyDatasService} from './service/my-datas.service';
import {GoToTopComponent} from './components/go-to-top/go-to-top.component';
import {ListPersonsComponent} from './components/list-persons/list-persons.component';
import {ScoreComponent} from './components/score/score.component';
import {SerieService} from './service/serie.service';
import {ListDatasComponent} from './components/list-datas/list-datas.component';
import {UtilsService} from './service/utils.service';
import {AddCollectionDirective} from './directives/add-collection.directive';
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import {DropdownLanguageComponent} from './components/dropdown-language/dropdown-language.component';
import {TabsComponent} from './components/tabs/tabs.component';
import {MetaService} from './components/meta/service/meta.service';
import {OmdbService} from './service/omdb.service';
import {FilterCrewPipe} from './pipes/filterCrew.pipe';
import {CapitalizeWordPipe} from './pipes/capitalizeWord.pipe';
import {MenuComponent} from './components/menu/menu.component';
import {SubstractDatePipe} from './pipes/substractDate.pipe';
import {ConvertToHHmmPipe} from './pipes/convertToHHmm.pipe';
import {ModalComponent} from './components/modal/modal.component';
import {MovieService} from './service/movie.service';
import {DropboxService} from './service/dropbox.service';
import {AuthService} from './service/auth.service';
import {TitleService} from './service/title.service';
import {PersonService} from './service/person.service';
import {GenreService} from './service/genre.service';
import {PersonSearchService} from './service/person-search.service';
import {MovieSearchService} from './service/movie-search.service';
import {CertificationService} from './service/certification.service';
import {KeywordSearchService} from './service/keyword-search.service';
import {ToastService} from './service/toast.service';
import {MovieSearchComponent} from './components/movie-search/movie-search.component';
import {PersonSearchComponent} from './components/person-search/person-search.component';
import {MockService} from './service/mock.service';
import {MenuService} from './service/menu.service';
import {TabsService} from './service/tabs.service';
import {OpenLinkDialogComponent} from './components/open-link-dialog/open-link-dialog.component';
import {OpenLinkDirective} from './directives/open-link.directive';
import {TruncatePipe} from './pipes/truncate.pipe';
import {MyTagsService} from './service/my-tags.service';
import {SearchTagComponent} from './components/search-tag/search-tag.component';
import {ListTagsComponent} from './components/list-tags/list-tags.component';
import {ImagePipe} from './pipes/image.pipe';
import {SerieSearchComponent} from './components/serie-search/serie-search.component';
import {VideosComponent} from './components/videos/videos.component';
import {CreditListComponent} from './components/credit-list/credit-list.component';
import {ListService} from './service/list.service';
import {MyMissingTranslationHandler} from './my-missing-translation-handler';
import {BookmarkedComponent} from './components/bookmarked/bookmarked.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ClickOutsideDirective,
    TruncatePipe,
    ImagePipe,
    VideosComponent,
    ListDatasComponent,
    MetaComponent,
    ListPersonsComponent,
    DropdownLanguageComponent,
    ScoreComponent,
    GoToTopComponent,
    AddCollectionDirective,
    ListTagsComponent,
    ModalComponent,
    SerieSearchComponent,
    MovieSearchComponent,
    OpenLinkDirective,
    SearchTagComponent,
    CreditListComponent,
    PersonSearchComponent,
    OpenLinkDialogComponent,
    MenuComponent,
    TabsComponent,
    ImageViewerComponent,
    BookmarkedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatListModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    SwiperModule,
    MatDialogModule,
    PinchZoomModule,
    MatTabsModule,
    NgbModule,
    TranslateModule,
    MatTooltipModule,
    RouterModule.forChild([]),
  ],
  exports: [
    TranslateModule,
    ConvertToHHmmPipe,
    SubstractDatePipe,
    TruncatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ImagePipe,
    GoToTopComponent,
    ListDatasComponent,
    VideosComponent,
    MetaComponent,
    CreditListComponent,
    OpenLinkDirective,
    SearchTagComponent,
    ListPersonsComponent,
    DropdownLanguageComponent,
    ListTagsComponent,
    AddCollectionDirective,
    TabsComponent,
    ScoreComponent,
    NgbModule,
    MatTooltipModule,
    MatStepperModule,
    ModalComponent,
    MovieSearchComponent,
    PersonSearchComponent,
    ImageViewerComponent,
    MenuComponent,
    SwiperModule,
    BookmarkedComponent,
  ],
})
export class SharedModule {
  constructor() {}

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: {hasBackdrop: false, closeOnNavigation: true},
        },
        MetaService,
        UtilsService,
        MovieService,
        OmdbService,
        SerieService,
        MyMissingTranslationHandler,
        LangService,
        DropboxService,
        AuthService,
        ListService,
        TitleService,
        PersonService,
        MyTagsService,
        GenreService,
        MockService,
        TabsService,
        MyDatasService,
        PersonSearchService,
        MovieSearchService,
        CertificationService,
        KeywordSearchService,
        MenuService,
        ToastService,
        CapitalizeWordPipe,
        DatePipe,
        ImagePipe,
        {
          provide: SWIPER_CONFIG,
          useValue: {},
        },
      ],
    };
  }
  static forChild(): ModuleWithProviders<SharedModule> {
    return {ngModule: SharedModule};
  }
}

export {UtilsService} from './service/utils.service';
export {MovieService} from './service/movie.service';
export {AuthService} from './service/auth.service';
export {TitleService} from './service/title.service';
export {PersonService} from './service/person.service';
export {GenreService} from './service/genre.service';
export {PersonSearchService} from './service/person-search.service';
export {MovieSearchService} from './service/movie-search.service';
export {CertificationService} from './service/certification.service';
export {LangService} from './service/lang.service';
export {KeywordSearchService} from './service/keyword-search.service';
export {ToastService} from './service/toast.service';
export {MenuService} from './service/menu.service';
export {TabsService} from './service/tabs.service';
export {SerieService} from './service/serie.service';
export {MyDatasService} from './service/my-datas.service';
export {ListService} from './service/list.service';
export {MyTagsService} from './service/my-tags.service';
export {MockService} from './service/mock.service';
export {MyMissingTranslationHandler} from './my-missing-translation-handler';
