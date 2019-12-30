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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SerieService } from './../../../../shared/service/serie.service';
import { SharedModule } from './../../../../shared/shared.module';
import { MovieService } from './../../../../shared/service/movie.service';
import { MovieSearchService } from './../../../../shared/service/movie-search.service';
import { Data } from './../../../../model/data';
import { SearchDataComponent } from './search-data.component';

describe('SearchDataComponent', () => {
  let component: SearchDataComponent<Data>;
  let fixture: ComponentFixture<SearchDataComponent<Data>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchDataComponent],
      providers: [MovieService, MovieSearchService, SerieService, TranslateService],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, MatSnackBarModule,
        RouterTestingModule, SharedModule.forRoot(), FontAwesomeModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
