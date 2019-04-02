import { filter, take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  faTrash, faHashtag, faImage, faFilm, faFlag, faCalendar, faStar, faGlobeAmericas, faList, faChevronCircleRight, faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import * as moment from 'moment-mini-ts';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ToastService } from './../../../../shared/service/toast.service';
import { Constants } from './../../../../constant/constants';
import { Utils } from './../../../../shared/utils';
import { MyTagsService } from './../../../../shared/service/my-tags.service';
import { TitleService, MovieService, MyMoviesService } from './../../../../shared/shared.module';
import { Tag, TagMovie } from './../../../../model/tag';
import { Movie } from './../../../../model/movie';
import { Genre, MovieDetailConfig, Level } from '../../../../model/model';

library.add(faClock);
library.add(faTimesCircle);

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MoviesComponent implements OnInit, OnDestroy {
  init_columns = ['id', 'thumbnail', 'title', 'original_title', 'date', 'note', 'meta', 'language',
    'genres', 'time', 'added', 'select', 'details', 'tag-icon'];
  medium_columns = ['thumbnail', 'title', 'date', 'note', 'meta', 'language', 'genres', 'time', 'added', 'select', 'details', 'tag-icon'];
  mobile_columns = ['thumbnail', 'title', 'date', 'meta', 'language', 'time', 'genres', 'select', 'details', 'tag-icon'];
  displayedColumns = this.init_columns;
  movies: Movie[];
  allMovies: Movie[];
  tags: Tag[];
  length: number;
  displayedData: Movie[];
  filter: string;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  page: PageEvent;
  sort: Sort;
  nbChecked = 0;
  genres: Genre[];
  filteredGenres: number[];
  expandedElement: Movie;
  expandedColumn = 'tags';
  displayedTags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);
  selectedTag: Tag;
  scrollTo: HTMLElement;
  subs = [];

  faTrash = faTrash;
  faHashtag = faHashtag;
  faImage = faImage;
  faFilm = faFilm;
  faFlag = faFlag;
  faCalendar = faCalendar;
  faStar = faStar;
  faGlobe = faGlobeAmericas;
  faList = faList;
  faAngleDown = faAngleDown;
  faChevronCircleRight = faChevronCircleRight;

  constructor(
    private movieService: MovieService,
    private breakpointObserver: BreakpointObserver,
    private myMoviesService: MyMoviesService,
    private myTagsService: MyTagsService,
    public translate: TranslateService,
    private toast: ToastService,
    private elemRef: ElementRef,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.movies');
    this.sort = { active: 'date', direction: 'desc' };
    this.breakpointObserver.observe([
      Constants.MEDIA_MAX_700,
      Constants.MEDIA_MAX_1000
    ]).subscribe(result => {
      if (result.breakpoints[Constants.MEDIA_MAX_1000] && result.breakpoints[Constants.MEDIA_MAX_700]) {
        this.displayedColumns = this.mobile_columns;
      } else if (result.breakpoints[Constants.MEDIA_MAX_1000] && !result.breakpoints[Constants.MEDIA_MAX_700]) {
        this.displayedColumns = this.medium_columns;
      } else {
        this.displayedColumns = this.init_columns;
      }
    });
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.getMovies(this.translate.currentLang);
    this.getTags();
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getMovies(event.lang);
    }));
  }

  getMovies(lang: string): void {
    this.myMoviesService.myMovies$.subscribe(movies => {
      this.allMovies = movies;
      this.movies = movies;
      this.length = this.movies.length;
      this.paginate(this.refreshData());
      this.getAllGenres();
    });
    this.myMoviesService.myMovies$.pipe(
      filter(movies => movies && movies.length !== 0),
      take(1)
    ).subscribe(movies => this.checkAndFixData(movies, lang));
  }

  getTags(): void {
    this.subs.push(this.myTagsService.myTags$.subscribe((tags) => this.tags = tags));
  }

  getAllGenres(): void {
    const all: Genre[] = [];
    this.movies.forEach((movie: Movie) => {
      all.push(...movie.genres);
    });
    this.genres = [];
    all.forEach((genre: Genre) => {
      if (!this.genres.map(g => g.id).includes(genre.id)) {
        this.genres.push(genre);
      }
    });
  }

  refreshData(): Movie[] {
    let list = this.filterGenres();
    list = Utils.sortMovie(
      Utils.filterByFields(list, this.displayedColumns.filter(col => !['added', 'select', 'details'].includes(col)), this.filter),
      this.sort);
    this.length = list.length;
    return list;
  }

  onSearch(): void {
    this.initPagination(this.refreshData());
    this.onTop();
  }

  onSort(): void {
    this.initPagination(this.refreshData());
    this.onTop();
  }

  onPaginateChange(): void {
    this.paginate(this.refreshData());
    this.onTop();
  }

  paginate(data: Movie[]): void {
    this.displayedData = this.page ?
      data.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize) : data.slice(0, this.pageSize);
  }

  initPagination(list: Movie[]): void {
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.paginate(list);
  }

  filterGenres(): Movie[] {
    let list = [];
    if (this.filteredGenres && this.filteredGenres.length > 0) {
      list = this.movies.filter((movie: Movie) => {
        return this.filteredGenres.every((genreId: number) => {
          return movie.genres.map(genre => genre.id).includes(genreId);
        });
      });
    } else {
      list = this.movies;
    }
    return list;
  }

  onFilterGenres(genres: number[]): void {
    this.filteredGenres = genres;
    let list = this.filterGenres();
    list = Utils.sortMovie(Utils.filterByFields(list, this.displayedColumns, this.filter), this.sort);
    this.length = list.length;
    this.initPagination(list);
    // this.onTop();
  }

  updateSize(): void {
    this.nbChecked = this.movies.filter(movie => movie.checked).length;
  }

  /**
   * Requests movies to MovieDb if some properties (genres, time, score) are missing or if the last updated is from more than two months ago.
   * @param  {Movie[]} movies movies to check
   * @param  {string} lang the lang to request the movie to
   */
  checkAndFixData(movies: Movie[], lang: string): void {
    let incomplete: number[] = [];
    const twoMonthsAgo = moment().add(-2, 'months');
    try {
      for (const movie of movies) {
        const tr = movie.translation.get(this.translate.currentLang);
        // TODO if a map is empty for a lang
        if (movie.time === undefined || tr.category === undefined || tr.category.map(genre => genre.name).every(name => name === undefined) ||
          movie.score === undefined || movie.updated === undefined || moment(movie.updated).isBefore(twoMonthsAgo)) {
          incomplete.push(movie.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
    incomplete = incomplete.slice(0, 30);
    const obs = [];
    incomplete.forEach((id: number) => {
      obs.push(this.movieService.getMovie(id, new MovieDetailConfig(false, false, false, false, false, false, false, false, lang), false));
    });

    try {
      forkJoin(obs).subscribe(
        (data: Movie[]) => {
          data.forEach(m => {
            m.updated = new Date();
            if (m.score === undefined) {
              m.score = {};
            }
          });
          this.myMoviesService.replaceMovies(data);
        },
        err => console.error(err)
      );
    } catch (err) {
      console.error(err);
    }
  }

  remove(): void {
    const moviesToRemove = this.movies.filter(movie => movie.checked);
    const tagsToReplace = this.tags.filter(t => moviesToRemove.map(m => m.tags).reduce((x, y) => x.concat(y), []).includes(t.id));
    tagsToReplace.forEach(t => t.movies = t.movies.filter(movie => !moviesToRemove.map(m => m.id).includes(movie.id)));
    this.myMoviesService.remove(moviesToRemove.map(movie => movie.id))
      .then(() => this.myTagsService.replaceTags(tagsToReplace));
    this.nbChecked = 0;
    this.onTop();
  }

  expand(element: Movie): void {
    this.expandedElement = this.expandedElement === element ? undefined : element;
    if (this.expandedElement) {
      this.displayedTags.next(this.tags.filter(t => t.movies.map(m => m.id).includes(this.expandedElement.id)));
    }
  }

  addTag(): void {
    let selectedMoviesIds = this.movies.filter(movie => movie.checked).map(movie => movie.id);
    selectedMoviesIds = selectedMoviesIds.filter(id => !this.selectedTag.movies.map(m => m.id).includes(id));
    if (selectedMoviesIds.length > 0) {
      this.selectedTag.movies.push(...selectedMoviesIds.map(id =>
        TagMovie.fromMovie(this.allMovies.filter(m => m.id === id))
      ));
      this.myTagsService.updateTag(this.selectedTag);
      this.myMoviesService.updateTag(this.selectedTag).then(() => {
        this.nbChecked = 0;
        this.selectedTag = undefined;
      });
    } else {
      this.toast.open(Level.warning, 'toast.already_added');
      this.nbChecked = 0;
      this.selectedTag = undefined;
      this.movies.forEach(m => m.checked = false);
    }
  }

  onTop(): void {
    this.elemRef.nativeElement.querySelector('.filters').scrollIntoView();
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
