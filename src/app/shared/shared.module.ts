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
import { ServiceUtils } from '../service/serviceUtils';
import { DropdownLanguageComponent } from './dropdown-language/dropdown-language.component';

@NgModule({
  declarations: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
    DropdownLanguageComponent
],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    TranslateModule.forChild()
  ],
  exports: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
    DropdownLanguageComponent
  ],
  providers: [
    MetaService, ServiceUtils, TranslateService
  ]
})

export class SharedModule {
  constructor() { }
}
