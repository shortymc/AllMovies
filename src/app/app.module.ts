import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module'; 

// Imports for loading & configuring the in-memory web api
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from './app.component';
import { MovieDetailComponent } from './movie-detail.component';
import { MoviesComponent } from './movies.component';
import { DashboardComponent } from './dashboard.component';
import { MovieService } from './movie.service';
import { MovieSearchComponent } from './movie-search.component';
import { ConvertToHHmmPipe } from './custom.pipe'; // import our pipe here

@NgModule({
  imports: [
    BrowserModule,
	FormsModule,    
    HttpModule,
//    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ConvertToHHmmPipe,
        MovieDetailComponent,
        MoviesComponent,
        MovieSearchComponent
    ], 
  providers: [MovieService],
  bootstrap: [AppComponent]
})
    
export class AppModule { }
