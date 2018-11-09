import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Movie } from '../../../model/movie';
import { MovieSearchService } from '../../service/movie-search.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  providers: [MovieSearchService]
})
export class MovieSearchComponent implements OnInit {
  @ViewChild('searchBox')
  inputSearch: HTMLFormElement;
  movies: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  showMovie = false;
  language: string;
  pseudo: string;
  faSearch = faSearch;

  constructor(
    private movieSearchService: MovieSearchService,
    private router: Router,
    private translate: TranslateService
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pseudo = AuthService.decodeToken().name;
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.search(this.inputSearch.nativeElement.value);
    });
    this.movies = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.movieSearchService.search(term, this.pseudo === 'Test', this.language)
          // or the observable of empty movies if there was no search term
          : of<Movie[]>([])),
        catchError(error => {
          // TODO: add real error handling
          console.log(error);
          return of<Movie[]>([]);
        }));
  }

  gotoDetail(movie: Movie): void {
    this.showMovie = false;
    this.router.navigate(['/movie', movie.id]);
  }
}
