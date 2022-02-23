import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserModule} from '@angular/platform-browser/';
import {FormsModule} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';

import {ToastService} from './../../../service/toast.service';
import {MetaComponent} from './meta.component';
import {UtilsService} from './../../../service/utils.service';
import {MetaService} from '../service/meta.service';

describe('MetaComponent', () => {
  let component: MetaComponent;
  let fixture: ComponentFixture<MetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetaComponent],
      providers: [TranslateService, MetaService, UtilsService, ToastService],
      imports: [
        BrowserModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FontAwesomeModule,
        HttpClientModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaComponent);
    component = fixture.componentInstance;
    component.entry = [];
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('MetaComponent');
  });
});
