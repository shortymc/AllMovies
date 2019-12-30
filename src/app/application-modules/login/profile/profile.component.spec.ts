import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { User } from '../../../model/user';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../shared/service/auth.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [TranslateService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, RouterTestingModule, SharedModule.forRoot(),
        MatSnackBarModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    const auth = TestBed.get(AuthService);
    spyOn(auth, 'getCurrentUser').and.returnValue(new Promise(resolve => resolve(new User(1, 'name', false, 'pass', 'q'))));
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ProfileComponent');
  });
});
