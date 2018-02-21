import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MovieSearchService } from '../../service/movie-search.service';
import { Movie } from '../../model/movie';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  providers: [MovieSearchService]
})
export class MovieSearchComponent implements OnInit {
  movies: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  adult = false;

  constructor(
    private movieSearchService: MovieSearchService,
    private router: Router) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.movies = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      // .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.movieSearchService.search(term, this.adult)
        // or the observable of empty movies if there was no search term
        : Observable.of<Movie[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Movie[]>([]);
      });
  }

  gotoDetail(movie: Movie): void {
    this.router.navigate(['/movie', movie.id]);
  }
}
