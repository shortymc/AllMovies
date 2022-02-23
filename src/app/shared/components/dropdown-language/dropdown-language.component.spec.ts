import {RouterTestingModule} from '@angular/router/testing';
import {BrowserModule} from '@angular/platform-browser/';
import {FormsModule} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

import {DropdownLanguageComponent} from './dropdown-language.component';
import {MockService} from './../../service/mock.service';

describe('DropdownLanguageComponent', () => {
  let component: DropdownLanguageComponent;
  let fixture: ComponentFixture<DropdownLanguageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownLanguageComponent],
      providers: [TranslateService, MockService],
      imports: [
        BrowserModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownLanguageComponent);
    component = fixture.componentInstance;
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('DropdownLanguageComponent');
  });
});
