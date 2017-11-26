import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { MovieDetailComponent } from './movie-detail.component';
import { PersonDetailComponent } from './person-detail.component';
import { MoviesComponent } from './movies.component';
import { DashboardComponent } from './dashboard.component';
import { MyNgbDate } from "./my-ngb-date";
import { ReleaseComponent } from './release.component';
import { MovieService } from './movie.service';
import { PersonService } from './person.service';
import { MovieSearchComponent } from './movie-search.component';
import { PersonSearchComponent } from './person-search.component';
import { substractDatePipe, ConvertToHHmmPipe, CapitalizeWordPipe, FilterCrewPipe } from './custom.pipe';
import {RatingModule} from "ngx-rating";

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
        substractDatePipe,
        CapitalizeWordPipe,
        FilterCrewPipe,
        MovieDetailComponent,
        ReleaseComponent,
        MoviesComponent,
        PersonDetailComponent,
        MovieSearchComponent,
        PersonSearchComponent
    ], 
  providers: [MovieService, PersonService, DatePipe,
              { provide: LOCALE_ID, useValue: "fr"},
              {provide: MyNgbDate, useClass: MyNgbDate}],
  bootstrap: [AppComponent]
})
    
export class AppModule { }
