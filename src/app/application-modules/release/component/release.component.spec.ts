import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserModule} from '@angular/platform-browser/';
import {FormsModule} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

import {MyNgbDate} from './../../../shared/my-ngb-date';
import {SharedModule} from '../../../shared/shared.module';
import {MovieService} from './../../../shared/service/movie.service';
import {ReleaseComponent} from './release.component';
import {MovieDetailModule} from '../../movie-detail/movie-detail.module';

describe('ReleaseComponent', () => {
  let component: ReleaseComponent;
  let fixture: ComponentFixture<ReleaseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReleaseComponent],
        providers: [
          {
            provide: MovieService,
            useValue: jasmine.createSpyObj('MovieService', [
              'getMoviesByReleaseDates',
            ]),
          },
          TranslateService,
          MyNgbDate,
          DatePipe,
        ],
        imports: [
          BrowserModule,
          FormsModule,
          TranslateModule.forRoot(),
          HttpClientModule,
          MovieDetailModule,
          RouterTestingModule,
          SharedModule.forRoot(),
          MatSnackBarModule,
          FontAwesomeModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseComponent);
    component = fixture.componentInstance;
    const movieService: jasmine.SpyObj<MovieService> =
      TestBed.get(MovieService);
    movieService.getMoviesByReleaseDates.and.callFake(
      () => new Promise(resolve => resolve([]))
    );
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ReleaseComponent');
  });
});
