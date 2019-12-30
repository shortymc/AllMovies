import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

import { UtilsService } from './../../service/utils.service';
import { CapitalizeWordPipe } from './../../pipes/capitalizeWord.pipe';
import { AuthService } from './../../service/auth.service';
import { ToastService } from './../../service/toast.service';
import { SearchTagComponent } from './search-tag.component';
import { MyTagsService } from './../../service/my-tags.service';
import { DropboxService } from '../../service/dropbox.service';

describe('SearchTagComponent', () => {
  let component: SearchTagComponent;
  let fixture: ComponentFixture<SearchTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTagComponent, CapitalizeWordPipe],
      providers: [MyTagsService, DropboxService, ToastService, UtilsService, AuthService, CapitalizeWordPipe],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule,
        MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatSnackBarModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
