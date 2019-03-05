import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { SharedModule, MovieService, PersonService } from './../../../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [TranslateService,
        {
          provide: MovieService,
          useValue: jasmine.createSpyObj('MovieService', ['getPopularMovies'])
        },
        {
          provide: PersonService,
          useValue: jasmine.createSpyObj('PersonService', ['getPopularPersons'])
        }
      ],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), HttpClientModule,
        RouterTestingModule, SharedModule.forRoot(), MatSnackBarModule, SwiperModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    const personService: jasmine.SpyObj<PersonService> = TestBed.get(PersonService);
    personService.getPopularPersons.and.callFake(() => new Promise((resolve) => resolve([])));
    const movieService: jasmine.SpyObj<MovieService> = TestBed.get(MovieService);
    movieService.getPopularMovies.and.callFake(() => new Promise((resolve) => resolve([])));
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
