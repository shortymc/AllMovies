import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
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
import {RatingComponent} from './rating.component';
import { ConvertToHHmmPipe } from './custom.pipe';
//import { StarRatingComponent } from './star-rating.component';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  imports: [
    BrowserModule,
	FormsModule,    
    HttpModule,
    CommonModule,
    StarRatingModule.forRoot(),
    AppRoutingModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ConvertToHHmmPipe,
        MovieDetailComponent,
//        StarRatingComponent,
        RatingComponent,
        MoviesComponent,
        MovieSearchComponent
    ], 
    exports: [RatingComponent],
  providers: [MovieService],
  bootstrap: [AppComponent]
})
    
export class AppModule { }
