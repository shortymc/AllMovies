import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubstractDatePipe, ConvertToHHmmPipe, CapitalizeWordPipe, FilterCrewPipe } from './custom.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListPersonsComponent } from './list-persons/list-persons.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { MetaComponent } from './meta/meta.component';
import './rxjs-operators';

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
  ]
})

export class SharedModule {
  constructor() { }
}
