import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CapitalizeWordPipe } from './../../pipes/capitalizeWord.pipe';
import { MenuComponent } from './menu.component';
import { TabsService } from '../../service/tabs.service';
import { MenuService } from '../../service/menu.service';
import { AuthService } from '../../service/auth.service';
import { PersonSearchComponent } from '../person-search/person-search.component';
import { MovieSearchComponent } from '../movie-search/movie-search.component';
import { DropdownLanguageComponent } from '../dropdown-language/dropdown-language.component';
import { GoToTopComponent } from '../go-to-top/go-to-top.component';
import { OpenLinkDirective } from '../../directives/open-link.directive';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { DropboxService } from '../../service/dropbox.service';
import { ToastService } from '../../service/toast.service';
import { UtilsService } from '../../service/utils.service';
import { ImagePipe } from '../../pipes/image.pipe';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  @Component({ selector: 'app-tabs', template: '' })
  class TabsStubComponent { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent, PersonSearchComponent, MovieSearchComponent, DropdownLanguageComponent,
        GoToTopComponent, TabsStubComponent, OpenLinkDirective, CapitalizeWordPipe, TruncatePipe, ImagePipe],
      providers: [TranslateService, AuthService, TabsService, MenuService, DropboxService, ToastService, UtilsService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule, MatToolbarModule, MatSidenavModule,
        MatListModule, MatSnackBarModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('MenuComponent');
  });
});
