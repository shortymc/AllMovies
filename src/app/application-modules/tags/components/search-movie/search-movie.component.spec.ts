import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
/* tslint:disable:no-unused-variable */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material';

import { SharedModule } from './../../../../shared/shared.module';
import { MovieService } from './../../../../shared/service/movie.service';
import { MovieSearchService } from './../../../../shared/service/movie-search.service';
import { SearchMovieComponent } from './search-movie.component';

describe('SearchMovieComponent', () => {
  let component: SearchMovieComponent;
  let fixture: ComponentFixture<SearchMovieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchMovieComponent],
      providers: [MovieSearchService, MovieService, TranslateService],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, MatSnackBarModule,
        RouterTestingModule, SharedModule.forRoot(), FontAwesomeModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
