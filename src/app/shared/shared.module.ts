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

@NgModule({
  declarations: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
  ],
  exports: [
    ConvertToHHmmPipe,
    SubstractDatePipe,
    CapitalizeWordPipe,
    FilterCrewPipe,
    ListMoviesComponent,
    MetaComponent,
    ListPersonsComponent,
  ],
  providers: [
    MetaService, ServiceUtils
  ]
})

export class SharedModule {
  constructor() { }
}
