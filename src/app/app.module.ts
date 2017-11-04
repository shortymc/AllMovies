import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { MovieDetailComponent } from './movie-detail.component';
import { MoviesComponent } from './movies.component';
import { DashboardComponent } from './dashboard.component';
import { MovieService } from './movie.service';
import { MovieSearchComponent } from './movie-search.component';
import { ConvertToHHmmPipe, CapitalizeWordPipe, FilterCrewPipe } from './custom.pipe';
import {RatingModule} from "ngx-rating";

@NgModule({
  imports: [
    BrowserModule,
	FormsModule,    
    HttpModule,
    CommonModule,
    RatingModule,
    AppRoutingModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ConvertToHHmmPipe,
        CapitalizeWordPipe,
        FilterCrewPipe,
        MovieDetailComponent,
        MoviesComponent,
        MovieSearchComponent
    ], 
  providers: [MovieService,
              { provide: LOCALE_ID, useValue: "fr" }],
  bootstrap: [AppComponent]
})
    
export class AppModule { }
