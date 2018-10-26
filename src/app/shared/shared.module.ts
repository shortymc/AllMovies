import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { MetaComponent } from './meta/component/meta.component';
import './rxjs-operators';
import { ListPersonsComponent } from './list-persons/list-persons.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { UtilsService } from './service/utils.service';
import { AddCollectionDirective } from './directives/add-collection.directive';
import { DropdownLanguageComponent } from './dropdown-language/dropdown-language.component';
import { MetaService } from './meta/service/meta.service';
import { OmdbService } from './service/omdb.service';
import { FilterCrewPipe } from './pipes/filterCrew.pipe';
import { CapitalizeWordPipe } from './pipes/capitalizeWord.pipe';
import { SubstractDatePipe } from './pipes/substractDate.pipe';
import { ConvertToHHmmPipe } from './pipes/convertToHHmm.pipe';
import { ModalComponent } from './modal/modal.component';
import { MovieService } from './service/movie.service';
import { DropboxService } from './service/dropbox.service';
import { AuthService } from './service/auth.service';
import { TitleService } from './service/title.service';
import { PersonService } from './service/person.service';
import { GenreService } from './service/genre.service';
import { PersonSearchService } from './service/person-search.service';
import { MovieSearchService } from './service/movie-search.service';
import { CertificationService } from './service/certification.service';
import { KeywordSearchService } from './service/keyword-search.service';
import { ToastService } from './service/toast.service';

@NgModule({
  declarations: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
    DropdownLanguageComponent,
    AddCollectionDirective,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    NgbModule,
    TranslateModule.forChild(),
    MatTooltipModule,
    RouterModule.forChild([])
  ],
  exports: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
    DropdownLanguageComponent,
    AddCollectionDirective,
    NgbModule,
    MatTooltipModule,
    MatStepperModule,
    ModalComponent
  ]
})

export class SharedModule {
  constructor() { }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MetaService,
        UtilsService,
        TranslateService,
        MovieService,
        OmdbService,
        DropboxService,
        AuthService,
        TitleService,
        PersonService,
        GenreService,
        PersonSearchService,
        MovieSearchService,
        CertificationService,
        KeywordSearchService,
        ToastService
      ]
    };
  }
  static forChild(): ModuleWithProviders {
    return { ngModule: SharedModule };
  }
}

export { UtilsService } from './service/utils.service';
export { MovieService } from './service/movie.service';
export { DropboxService } from './service/dropbox.service';
export { AuthService } from './service/auth.service';
export { TitleService } from './service/title.service';
export { PersonService } from './service/person.service';
export { GenreService } from './service/genre.service';
export { PersonSearchService } from './service/person-search.service';
export { MovieSearchService } from './service/movie-search.service';
export { CertificationService } from './service/certification.service';
export { KeywordSearchService } from './service/keyword-search.service';
export { ToastService } from './service/toast.service';
