import { Utils } from './../../../../shared/utils';
import { DropboxService } from './../../../../service/dropbox.service';
import { Movie } from './../../../../model/movie';
import { MovieService } from './../../../../service/movie.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

const init_columns = ['id', 'thumbnail', 'title', 'original_title', 'date', 'note', 'language', 'genres', 'time', 'select'];

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {
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
  constructor(private movieService: MovieService, private router: Router, private breakpointObserver: BreakpointObserver,
    private dropboxService: DropboxService) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 700px)'
    ]).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['thumbnail', 'title', 'date', 'note', 'language', 'time', 'genres', 'select'] : init_columns;
    });
    this.getMovies();
  }

  getMovies(): void {
    this.dropboxService.getAllMovies('ex.json').then(movies => {
      this.movies = movies;
      this.length = this.movies.length;
      this.checkAndFixData();
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
    const list = this.sortData(Utils.filterByFields(this.movies, this.displayedColumns, this.filter));
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
    list = this.sortData(Utils.filterByFields(list, this.displayedColumns, this.filter));
    this.length = list.length;
    this.initPagination(list);
  }

  sortData(list: Movie[]): Movie[] {
    if (this.sort && this.sort.active && this.sort.direction !== '') {
      return list.sort((a, b) => {
        const isAsc = this.sort.direction === 'asc';
        switch (this.sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'title':
            return Utils.compare(a.title, b.title, isAsc);
          case 'original_title':
            return Utils.compare(a.original_title, b.original_title, isAsc);
          case 'note':
            return Utils.compare(+a.note, +b.note, isAsc);
          case 'language':
            return Utils.compare(a.language, b.language, isAsc);
          case 'date':
            return Utils.compareDate(a.date, b.date, isAsc);
          case 'time':
            return Utils.compare(+a.time, +b.time, isAsc);
          default:
            return 0;
        }
      });
    } else {
      return list;
    }
  }

  updateSize() {
    this.nbChecked = this.movies.filter(movie => movie.checked).length;
  }

  checkAndFixData(): void {
    let incomplete: number[] = [];
    for (const movie of this.movies) {
      if ((movie.time === undefined && movie.time == null)
        || (movie.genres === undefined && movie.genres == null)
        || (movie.original_title === undefined || movie.original_title == null || movie.original_title === '')) {
        incomplete.push(movie.id);
      }
    }
    incomplete = incomplete.slice(0, 30);
    const obs = incomplete.map((id: number) => {
      return this.movieService.getMovie(id, false, false, false, false, 'fr');
    });

    forkJoin(obs).subscribe(
      data => {
        console.log(data);
        this.dropboxService.replaceMovies(data, 'ex.json');
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

  ngOnDestroy() {
    console.log('destroy');
    // this.dropboxService.uploadFile(new Date(), 'test.json');
  }

}
