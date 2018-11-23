import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

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
  faBookmark = faBookmark;

  constructor(
    public translate: TranslateService,
    private elemRef: ElementRef
  ) { }

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
    this.elemRef.nativeElement.scrollIntoView();
  }

}
