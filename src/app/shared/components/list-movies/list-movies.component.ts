import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnInit {
  _movies = new BehaviorSubject<Movie[]>(undefined);
  @Input()
  set movies(value: Movie[]) {
    this._movies.next(value);
  }

  get movies(): Movie[] {
    return this._movies.getValue();
  }
  @Input()
  label: string;
  page: number;
  moviesToShow: Movie[];
  pageSize = 5;
  faSave = faSave;

  constructor() { }

  ngOnInit(): void {
    this._movies
      .subscribe(x => {
        this.page = 1;
        this.getMoviesToShow(this.movies, this.page);
      });
  }

  getMoviesToShow(movies: Movie[], page: number): void {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  pageChanged(event: any): void {
    this.getMoviesToShow(this.movies, event);
  }

}
