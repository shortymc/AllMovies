import { MatCheckboxModule } from '@angular/material/checkbox';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
/* tslint:disable:no-unused-variable */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TagMoviesComponent } from './tag-movies.component';
import { SharedModule } from './../../../../shared/shared.module';
import { ToastService } from './../../../../shared/service/toast.service';
import { AuthService } from './../../../../shared/service/auth.service';
import { MyMoviesService } from './../../../../shared/service/my-movies.service';
import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { MenuService } from './../../../../shared/service/menu.service';
import { SearchMovieComponent } from '../search-movie/search-movie.component';

describe('TagMoviesComponent', () => {
  let component: TagMoviesComponent;
  let fixture: ComponentFixture<TagMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagMoviesComponent, SearchMovieComponent],
      providers: [MenuService, MyTagsService, MyMoviesService, AuthService, TranslateService, ToastService],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, MatSnackBarModule,
        RouterTestingModule, SharedModule.forRoot(), FontAwesomeModule, MatInputModule, MatFormFieldModule, MatTableModule, ColorPickerModule,
        MatSortModule, MatPaginatorModule, MatCheckboxModule, MatAutocompleteModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
