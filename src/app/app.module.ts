import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent }   from './component/dashboard/dashboard.component';
import { MoviesComponent }      from './component/movies/movies.component';
import { MovieDetailComponent }  from './component/movie-detail/movie-detail.component';
import { PersonDetailComponent }  from './component/person-detail/person-detail.component';
import { ReleaseComponent }  from './component/release/release.component';
import { MovieSearchComponent } from './component/movie-search/movie-search.component';
import { PersonSearchComponent } from './component/person-search/person-search.component';
import { MyNgbDate } from './my-ngb-date';
import { MovieService } from './service/movie.service';
import { DropboxService } from './service/dropbox.service';
import { PersonService } from './service/person.service';
import { SubstractDatePipe, ConvertToHHmmPipe, CapitalizeWordPipe, FilterCrewPipe } from './custom.pipe';
import {RatingModule} from 'ngx-rating';

import * as $ from 'jquery';
import 'datatables.net';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    RatingModule,
    AppRoutingModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ConvertToHHmmPipe,
        SubstractDatePipe,
        CapitalizeWordPipe,
        FilterCrewPipe,
        MovieDetailComponent,
        ReleaseComponent,
        MoviesComponent,
        PersonDetailComponent,
        MovieSearchComponent,
        PersonSearchComponent
    ],
  providers: [MovieService, PersonService, DatePipe, DropboxService, ConvertToHHmmPipe,
              { provide: LOCALE_ID, useValue: 'fr'},
              {provide: MyNgbDate, useClass: MyNgbDate}],
  bootstrap: [AppComponent]
})

export class AppModule { }
