import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortDirection } from '@angular/material';

import { Movie } from '../../../model/movie';
import { Utils } from './../../utils';
import { DropDownChoice } from '../../../model/model';

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

  movieList: Movie[];
  page: number;
  moviesToShow: Movie[];
  sortChoices: DropDownChoice[];
  sortChosen: DropDownChoice;
  sortDir: SortDirection;
  pageSize = 5;

  constructor(
    public translate: TranslateService,
    private elemRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.sortChoices = [new DropDownChoice('discover.sort_field.popularity', 'popularity'),
    new DropDownChoice('discover.sort_field.release_date', 'date'), new DropDownChoice('discover.sort_field.original_title', 'title'),
    new DropDownChoice('discover.sort_field.vote_average', 'note'), new DropDownChoice('discover.sort_field.vote_count', 'vote_count')];
    this.sortChosen = this.sortChoices[0];
    this.sortDir = 'desc';
    this._movies
      .subscribe(x => {
        this.movieList = this.movies;
        this.sortChanged(false);
      });
  }

  getMoviesToShow(movies: Movie[], page: number): void {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  sortChanged(scroll: boolean): void {
    this.movieList = Utils.sortMovie(this.movieList, { active: this.sortChosen.value, direction: this.sortDir });
    this.page = 1;
    this.getMoviesToShow(this.movieList, this.page);
    if (scroll) {
      this.elemRef.nativeElement.scrollIntoView();
    }
  }

  pageChanged(event: any): void {
    this.getMoviesToShow(this.movieList, event);
    this.elemRef.nativeElement.scrollIntoView();
  }

}
