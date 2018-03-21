import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../model/movie';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnInit {
  @Input()
  movies: Movie[];
  @Input()
  label: string;
  page = 1;
  moviesToShow: Movie[];
  pageSize = 5;

  constructor() { }

  ngOnInit() {
    this.getMoviesToShow(this.movies, this.page);
  }

  getMoviesToShow(movies, page) {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  pageChanged(event: any) {
    this.getMoviesToShow(this.movies, event);
  }

}
