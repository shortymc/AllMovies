import { MovieService } from './../service/movie.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MetaService } from './meta/service/meta.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubstractDatePipe, ConvertToHHmmPipe, CapitalizeWordPipe, FilterCrewPipe } from './custom.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListPersonsComponent } from './list-persons/list-persons.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { MetaComponent } from './meta/component/meta.component';
import './rxjs-operators';
import { MatStepperModule } from '@angular/material/stepper';
import { ServiceUtils } from '../service/serviceUtils';
import { DropdownLanguageComponent } from './dropdown-language/dropdown-language.component';
import { AddCollectionDirective } from './add-collection.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    AddCollectionDirective
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    RouterModule,
    NgbModule,
    TranslateModule.forChild(),
    MatTooltipModule
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
    MatStepperModule
  ],
  providers: [
    MetaService, ServiceUtils, TranslateService, MovieService
  ]
})

export class SharedModule {
  constructor() { }
}
