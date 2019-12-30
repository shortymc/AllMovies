import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NouisliderModule } from 'ng2-nouislider';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MyMoviesService } from './../../../shared/service/my-movies.service';
import { DiscoverComponent } from './discover.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ImagePipe } from './../../../shared/pipes/image.pipe';
import { CapitalizeWordPipe } from './../../../shared/pipes/capitalizeWord.pipe';
import { OpenLinkDirective } from './../../../shared/directives/open-link.directive';
import { AddCollectionDirective } from './../../../shared/directives/add-collection.directive';
import { ToastService } from './../../../shared/service/toast.service';
import { MenuService } from './../../../shared/service/menu.service';
import { KeywordSearchService } from './../../../shared/service/keyword-search.service';
import { CertificationService } from './../../../shared/service/certification.service';
import { MovieSearchService } from './../../../shared/service/movie-search.service';
import { PersonSearchService } from './../../../shared/service/person-search.service';
import { TabsService } from './../../../shared/service/tabs.service';
import { MockService } from './../../../shared/service/mock.service';
import { GenreService } from './../../../shared/service/genre.service';
import { PersonService } from './../../../shared/service/person.service';
import { TitleService } from './../../../shared/service/title.service';
import { AuthService } from './../../../shared/service/auth.service';
import { DropboxService } from './../../../shared/service/dropbox.service';
import { OmdbService } from './../../../shared/service/omdb.service';
import { MovieService } from './../../../shared/service/movie.service';
import { UtilsService } from './../../../shared/service/utils.service';
import { MetaService } from './../../../shared/components/meta/service/meta.service';

describe('DiscoverComponent', () => {
  let component: DiscoverComponent;
  let fixture: ComponentFixture<DiscoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverComponent, SearchBoxComponent, AddCollectionDirective, OpenLinkDirective, CapitalizeWordPipe, ImagePipe],
      providers: [TranslateService, MetaService, UtilsService, OmdbService, DropboxService, AuthService, TitleService, PersonService,
        { provide: MovieService, useValue: jasmine.createSpyObj('MovieService', ['getMoviesPlaying']) },
        { provide: MyMoviesService, useValue: jasmine.createSpyObj('MyMoviesService', ['getAll']) }, GenreService, MockService,
        TabsService, PersonSearchService, MovieSearchService, CertificationService, KeywordSearchService, MenuService, ToastService],
      imports: [BrowserModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule, TranslateModule.forRoot(),
        MatListModule, FontAwesomeModule, MatIconModule, MatPaginatorModule, MatInputModule, MatCheckboxModule,
        MatAutocompleteModule, MatSlideToggleModule, NouisliderModule, MatSelectModule, MatFormFieldModule,
        MatChipsModule, MatButtonToggleModule, HttpClientModule, MatSnackBarModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverComponent);
    component = fixture.componentInstance;
    const spyMyMoviesService = TestBed.get(MyMoviesService);
    spyMyMoviesService.getAll.and.returnValue([]);
    const spyMovieService = TestBed.get(MovieService);
    spyMovieService.getMoviesPlaying.and.returnValue(new Promise(resolve => resolve([])));
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('DiscoverComponent');
  });
});
