import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserModule} from '@angular/platform-browser/';
import {FormsModule} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GoToTopComponent} from './go-to-top.component';

describe('GoToTopComponent', () => {
  let component: GoToTopComponent;
  let fixture: ComponentFixture<GoToTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GoToTopComponent],
      providers: [TranslateService],
      imports: [
        BrowserModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FontAwesomeModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToTopComponent);
    component = fixture.componentInstance;
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('GoToTopComponent');
  });
});
