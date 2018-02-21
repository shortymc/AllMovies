import { SharedModule } from './shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MoviesComponent } from './component/movies/movies.component';
import { PersonDetailComponent } from './component/person-detail/person-detail.component';
import { ReleaseComponent } from './component/release/release.component';
import { MovieSearchComponent } from './component/movie-search/movie-search.component';
import { PersonSearchComponent } from './component/person-search/person-search.component';
import { MyNgbDate } from './Shared/my-ngb-date';
import { MovieService } from './service/movie.service';
import { DropboxService } from './service/dropbox.service';
import { PersonService } from './service/person.service';
import { RatingModule } from 'ngx-rating';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import './shared/rxjs-operators';
import 'bootstrap';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    RatingModule,
    AppRoutingModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    ReleaseComponent,
    MoviesComponent,
    PersonDetailComponent,
    MovieSearchComponent,
    PersonSearchComponent
  ],
  providers: [MovieService, PersonService, DatePipe, DropboxService,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: MyNgbDate, useClass: MyNgbDate }],
  bootstrap: [AppComponent]
})

export class AppModule { }
