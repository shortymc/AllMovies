import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CapitalizeWordPipe } from './../../pipes/capitalizeWord.pipe';
import { ListPersonsComponent } from './list-persons.component';
import { OpenLinkDirective } from '../../directives/open-link.directive';

describe('ListPersonsComponent', () => {
  let component: ListPersonsComponent;
  let fixture: ComponentFixture<ListPersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPersonsComponent, OpenLinkDirective, CapitalizeWordPipe],
      providers: [TranslateService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPersonsComponent);
    component = fixture.componentInstance;
    component.label = 'label';
    component.persons = [];
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ListPersonsComponent');
  });
});
