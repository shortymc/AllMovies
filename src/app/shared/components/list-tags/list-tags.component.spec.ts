/* tslint:disable:no-unused-variable */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTagComponent } from './../search-tag/search-tag.component';
import { CapitalizeWordPipe } from './../../pipes/capitalizeWord.pipe';
import { UtilsService } from './../../service/utils.service';
import { DropboxService } from './../../service/dropbox.service';
import { ToastService } from './../../service/toast.service';
import { AuthService } from './../../service/auth.service';
import { MyMoviesService } from './../../service/my-movies.service';
import { MyTagsService } from './../../service/my-tags.service';
import { MenuService } from './../../service/menu.service';
import { ListTagsComponent } from './list-tags.component';

describe('ListTagsComponent', () => {
  let component: ListTagsComponent;
  let fixture: ComponentFixture<ListTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTagsComponent, SearchTagComponent],
      providers: [MenuService, MyTagsService, MyMoviesService, AuthService, TranslateService,
        ToastService, DropboxService, UtilsService, CapitalizeWordPipe],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, MatSnackBarModule,
        RouterTestingModule, FontAwesomeModule, MatAutocompleteModule, MatFormFieldModule, MatChipsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
