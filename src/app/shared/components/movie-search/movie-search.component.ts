import { TranslateService} from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Movie } from '../../../model/movie';
import { ImageSize } from '../../../model/model';
import { MovieSearchService } from '../../service/movie-search.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  providers: [MovieSearchService]
})
export class MovieSearchComponent implements OnInit, OnDestroy {
  movies: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  showMovie = false;
  adult: boolean;
  subs = [];
  imageSize = ImageSize;
  faSearch = faSearch;

  constructor(
    private movieSearchService: MovieSearchService,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.adult = user.adult;
      }
    });
    this.movies = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.movieSearchService.search(term, this.adult, this.translate.currentLang)
          // or the observable of empty movies if there was no search term
          : of<Movie[]>([])),
        catchError(error => {
          // TODO: add real error handling
          console.log(error);
          return of<Movie[]>([]);
        }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
