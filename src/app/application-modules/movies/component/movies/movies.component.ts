import { Utils } from './../../../../shared/utils';
import { DropboxService } from './../../../../service/dropbox.service';
import { Movie } from './../../../../model/movie';
import { MovieService } from './../../../../service/movie.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

const init_columns = ['id', 'thumbnail', 'title', 'original_title', 'date', 'note', 'language', 'genres', 'time', 'select'];

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('goToTop') goToTop: HTMLFormElement;
  displayedColumns = init_columns;
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
  genres: string[];
  filteredGenres: MatSelectChange;
  language: string;

  constructor(private movieService: MovieService, private router: Router, private breakpointObserver: BreakpointObserver,
    private dropboxService: DropboxService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 700px)'
    ]).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['thumbnail', 'title', 'date', 'note', 'language', 'time', 'genres', 'select'] : init_columns;
    });
    this.getMovies();
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.getMovies();
    });
  }

  ngAfterViewInit() {
    window.addEventListener('scroll', (event) => {
      this.onScroll(event);
    });
  }

  getMovies(): void {
    this.dropboxService.getAllMovies('ex.json').then(movies => {
      // this.checkAndFixData(movies);
      this.movies = movies.filter(movie => movie.lang_version === this.language);
      this.length = this.movies.length;
      this.initPagination(this.movies);
      this.getAllGenres();
      // localStorage.setItem('movies', JSON.stringify(movies));
    });
  }

  getAllGenres() {
    const all = [];
    this.movies.forEach((movie: Movie) => {
      all.push(...movie.genres);
    });
    this.genres = [];
    all.forEach((genre: string) => {
      if (!this.genres.includes(genre)) {
        this.genres.push(genre);
      }
    });
  }

  refreshData(): Movie[] {
    const list = Utils.sortMovie(Utils.filterByFields(this.movies, this.displayedColumns, this.filter), this.sort);
    this.length = list.length;
    return list;
  }

  onSearch() {
    this.initPagination(this.refreshData());
  }

  onSort() {
    this.initPagination(this.refreshData());
  }

  onPaginateChange() {
    this.paginate(this.refreshData());
  }

  paginate(data: Movie[]) {
    this.displayedData = this.page ?
      data.slice(this.page.pageIndex * this.page.pageSize, (this.page.pageIndex + 1) * this.page.pageSize) : data.slice(0, this.pageSize);
  }

  initPagination(list: Movie[]) {
    if (this.page) {
      this.page.pageIndex = 0;
      this.page.pageSize = this.page ? this.page.pageSize : this.pageSize;
    }
    this.paginate(list);
  }

  onFilterGenres(event: MatSelectChange) {
    let list = [];
    if (event.value.length > 0) {
      list = this.movies.filter((movie: Movie) => {
        return event.value.every(genre => {
          return movie.genres.includes(genre);
        });
      });
    } else {
      list = this.movies;
    }
    list = Utils.sortMovie(Utils.filterByFields(list, this.displayedColumns, this.filter), this.sort);
    this.length = list.length;
    this.initPagination(list);
  }

  updateSize() {
    this.nbChecked = this.movies.filter(movie => movie.checked).length;
  }

  checkAndFixData(movies: Movie[]): void {
    let incomplete: number[] = [];
    const map = new Map();
    try {
      for (const movie of movies) {
        if ((movie.time === undefined && movie.time == null)
          || (movie.genres === undefined && movie.genres == null)
          // || (movie.original_title === undefined || movie.original_title == null || movie.original_title === '')
        ) {
          incomplete.push(movie.id);
        }
        const res = map.get(movie.id);
        if (!res) {
          map.set(movie.id, [movie.lang_version]);
        } else {
          res.push(movie.lang_version);
        }
      }
      const ids = movies.map(movie => movie.id);
      for (const id of ids) {
        const val = map.get(id);
        if (val.length !== 2) {
          incomplete.push(id);
        }
      }
    } catch (err) {
      console.log(err);
    }
    incomplete = incomplete.slice(0, 35);
    const obs = incomplete.map((id: number) => {
      return this.movieService.getMovie(id, false, false, false, false, 'en');
    });

    forkJoin(obs).subscribe(
      data => {
        this.dropboxService.addMovieList(data, 'ex.json');
      },
      err => console.error(err)
    );
  }

  gotoDetail(id: number, event): void {
    const key = event.which;
    if (key === 1) {
      this.router.navigate(['movie', id]);
    } else if (key === 2) {
      window.open('/movie/' + id);
    }
  }

  remove() {
    const ids = this.movies.filter(movie => movie.checked).map(movie => movie.id);
    this.movies = this.movies.filter(movie => !movie.checked);
    if (this.filteredGenres) {
      this.onFilterGenres(this.filteredGenres);
    } else {
      this.paginate(this.refreshData());
    }
    this.dropboxService.removeMovieList(ids, 'ex.json');
    this.nbChecked = 0;
  }

  onTop() {
    window.scrollTo({ top: 0 });
  }

  onScroll($event) {
    if ($event.target.scrollingElement.scrollTop > window.innerHeight / 3) {
      this.goToTop.nativeElement.classList.remove('transparent');
      this.goToTop.nativeElement.classList.remove('fadeOut');
      this.goToTop.nativeElement.classList.add('fadeIn');
    } else {
      this.goToTop.nativeElement.classList.add('fadeOut');
      this.goToTop.nativeElement.classList.remove('fadeIn');
    }
  }

  ngOnDestroy() {
    console.log('destroy');
    // this.dropboxService.uploadFile(new Date(), 'test.json');
  }

}
