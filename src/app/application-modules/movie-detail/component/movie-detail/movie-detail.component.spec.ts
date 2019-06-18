import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from './../../../shared/shared.module';
import { MovieDetailComponent } from './movie-detail.component';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovieDetailComponent],
      providers: [TranslateService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), HttpClientModule,
        RouterTestingModule, SharedModule.forRoot(), MatSnackBarModule, FontAwesomeModule, MatTableModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('MovieDetailComponent');
  });
});
