import { TranslateService } from '@ngx-translate/core';
import { Component, Input, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { SortDirection } from '@angular/material';

import { Movie } from '../../../model/movie';
import { Utils } from './../../utils';
import { DropDownChoice } from '../../../model/model';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnChanges {
  @Input()
  label: string;
  @Input()
  movies: Movie[];

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

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const field of Object.keys(changes)) {
      if (field === 'movies') {
        this.movies = changes[field].currentValue;
        this.initSortProperties();
        this.sortChanged(false);
      }
    }
  }

  getMoviesToShow(movies: Movie[], page: number): void {
    this.moviesToShow = movies.slice((page - 1) * this.pageSize, page * this.pageSize);
  }

  sortChanged(scroll: boolean): void {
    this.movies = Utils.sortMovie(this.movies, { active: this.sortChosen.value, direction: this.sortDir });
    this.page = 1;
    this.getMoviesToShow(this.movies, this.page);
    if (scroll) {
      this.elemRef.nativeElement.scrollIntoView();
    }
  }

  initSortProperties(): void {
    if (!this.sortDir) {
      this.sortDir = 'desc';
    }
    if (!this.sortChoices || this.sortChoices.length === 0) {
      this.sortChoices = [new DropDownChoice('discover.sort_field.popularity', 'popularity'),
      new DropDownChoice('discover.sort_field.release_date', 'date'), new DropDownChoice('discover.sort_field.original_title', 'title'),
      new DropDownChoice('discover.sort_field.vote_average', 'note'), new DropDownChoice('discover.sort_field.vote_count', 'vote_count')];
    }
    if (!this.sortChosen) {
      this.sortChosen = this.sortChoices[0];
    }
  }

  pageChanged(event: any): void {
    this.getMoviesToShow(this.movies, event);
    this.elemRef.nativeElement.scrollIntoView();
  }

}
