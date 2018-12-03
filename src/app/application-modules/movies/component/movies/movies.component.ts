import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {
  faTrash, faHashtag, faImage, faFilm, faFlag, faCalendar, faStar, faGlobeAmericas, faList, faChevronCircleRight
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import { Utils } from './../../../../shared/utils';
import { TitleService, AuthService, MovieService, MyMoviesService } from './../../../../shared/shared.module';
import { Movie } from './../../../../model/movie';
import { Genre, MovieDetailConfig } from '../../../../model/model';

library.add(faClock);
library.add(faTimesCircle);

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {
  init_columns = ['id', 'thumbnail', 'title', 'original_title', 'date', 'note', 'meta', 'language', 'genres', 'time', 'added', 'select', 'details'];
  medium_columns = ['thumbnail', 'title', 'date', 'note', 'meta', 'language', 'genres', 'time', 'added', 'select', 'details'];
  mobile_columns = ['thumbnail', 'title', 'date', 'meta', 'language', 'time', 'genres', 'select', 'details'];
  displayedColumns = this.init_columns;
  movies: Movie[];
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
  filteredGenres: MatSelectChange;
  scrollTo: HTMLElement;

  faTrash = faTrash;
  faHashtag = faHashtag;
  faImage = faImage;
  faFilm = faFilm;
  faFlag = faFlag;
  faCalendar = faCalendar;
  faStar = faStar;
  faGlobe = faGlobeAmericas;
  faList = faList;
  faChevronCircleRight = faChevronCircleRight;

  constructor(
    private movieService: MovieService,
    private breakpointObserver: BreakpointObserver,
    private myMoviesService: MyMoviesService,
    private translate: TranslateService,
    private elemRef: ElementRef,
    private auth: AuthService,
    private title: TitleService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('title.movies');
    this.sort = { active: 'date', direction: 'desc' };
    this.breakpointObserver.observe([
      '(max-width: 700px)',
      '(max-width: 1000px)'
    ]).subscribe(result => {
      if (result.breakpoints['(max-width: 1000px)'] && result.breakpoints['(max-width: 700px)']) {
        this.displayedColumns = this.mobile_columns;
      } else if (result.breakpoints['(max-width: 1000px)'] && !result.breakpoints['(max-width: 700px)']) {
        this.displayedColumns = this.medium_columns;
      } else {
        this.displayedColumns = this.init_columns;
      }
    });
    this.getMovies(this.translate.currentLang);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getMovies(event.lang);
    });
  }

  getMovies(lang: string): void {
    this.myMoviesService.myMovies$.subscribe(movies => {
      this.movies = movies.filter(movie => movie.lang_version === lang);
      // this.checkAndFixData(this.movies, this.language);
      this.length = this.movies.length;
      this.initPagination(this.refreshData());
      this.getAllGenres();
      // localStorage.setItem('movies', JSON.stringify(movies));
    });
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
    list = Utils.sortMovie(Utils.filterByFields(list, this.displayedColumns, this.filter), this.sort);
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
    if (this.filteredGenres && this.filteredGenres.value.length > 0) {
      list = this.movies.filter((movie: Movie) => {
        return this.filteredGenres.value.every((genreId: number) => {
          return movie.genres.map(genre => genre.id).includes(genreId);
        });
      });
    } else {
      list = this.movies;
    }
    return list;
  }

  onFilterGenres(event: MatSelectChange): void {
    this.filteredGenres = event;
    let list = this.filterGenres();
    list = Utils.sortMovie(Utils.filterByFields(list, this.displayedColumns, this.filter), this.sort);
    this.length = list.length;
    this.initPagination(list);
    // this.onTop();
  }

  updateSize(): void {
    this.nbChecked = this.movies.filter(movie => movie.checked).length;
  }

  checkAndFixData(movies: Movie[], lang: string): void {
    let incomplete: number[] = [];
    // const map = new Map();
    try {
      for (const movie of movies) {
        if ((movie.time === undefined)
          || (movie.genres === undefined)
          || (movie.score === undefined)
          || (movie.genres.map(genre => genre.name).every(name => name === undefined))
          // || (movie.original_title === undefined || movie.original_title == null || movie.original_title === '')
        ) {
          incomplete.push(movie.id);
        }
        // const res = map.get(movie.id);
        // if (!res) {
        //   map.set(movie.id, [movie.lang_version]);
        // } else {
        //   res.push(movie.lang_version);
        // }
      }
      //   const ids = movies.map(movie => movie.id);
      //   for (const id of ids) {
      //     const val = map.get(id);
      //     if (val.length !== 2) {
      //       incomplete.push(id);
      //     }
      //   }
    } catch (err) {
      console.log(err);
    }
    incomplete = incomplete.slice(0, 30);
    const obs = [];
    incomplete.map((id: number) => {
      obs.push(this.movieService.getMovie(id, new MovieDetailConfig(false, false, false, false, false, false), false, lang));
    });

    try {
      forkJoin(obs).subscribe(
        (data: Movie[]) => {
          this.auth.getFileName().then((fileName) => {
            this.myMoviesService.replaceMovies(data, fileName);
          });
        },
        err => console.error(err)
      );
    } catch (err) {
      console.error(err);
    }
  }

  remove(): void {
    const ids = this.movies.filter(movie => movie.checked).map(movie => movie.id);
    this.movies = this.movies.filter(movie => !movie.checked);
    if (this.filteredGenres) {
      this.onFilterGenres(this.filteredGenres);
    } else {
      this.paginate(this.refreshData());
    }
    this.auth.getFileName().then((fileName) => {
      this.myMoviesService.remove(ids, fileName);
    });
    this.nbChecked = 0;
    this.onTop();
  }

  onTop(): void {
    this.elemRef.nativeElement.querySelector('.filters').scrollIntoView();
  }

  ngOnDestroy(): void {
    console.log('destroy');
    // this.dropboxService.uploadFile(new Date(), 'test.json');
  }

}
