import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Movie } from '../../../model/movie';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnInit {
  _movies = new BehaviorSubject<Movie[]>(null);
  @Input()
  set movies(value) {
    this._movies.next(value);
  }

  get movies() {
    return this._movies.getValue();
  }
  @Input()
  label: string;
  page: number;
  moviesToShow: Movie[];
  pageSize = 5;

  constructor() { }

  ngOnInit() {
    this._movies
    .subscribe(x => {
        this.page = 1;
        this.getMoviesToShow(this.movies, this.page);
      });
  }

  getMoviesToShow(movies, page) {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  pageChanged(event: any) {
    this.getMoviesToShow(this.movies, event);
  }

}
