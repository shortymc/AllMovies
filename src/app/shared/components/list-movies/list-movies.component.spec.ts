import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule, MatSelectModule, MatFormFieldModule, MatTooltipModule } from '@angular/material';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { OpenLinkDirective } from './../../directives/open-link.directive';
import { CapitalizeWordPipe } from './../../pipes/capitalizeWord.pipe';
import { ListMoviesComponent } from './list-movies.component';
import { AddCollectionDirective } from '../../directives/add-collection.directive';

describe('ListMoviesComponent', () => {
  let component: ListMoviesComponent;
  let fixture: ComponentFixture<ListMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListMoviesComponent, OpenLinkDirective, CapitalizeWordPipe, AddCollectionDirective],
      providers: [TranslateService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule, MatButtonToggleModule,
        MatSelectModule, MatFormFieldModule, NgbModule, MatTooltipModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMoviesComponent);
    component = fixture.componentInstance;
    component.label = 'TEST';
    component.movies = [];
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ListMoviesComponent');
  });
});
