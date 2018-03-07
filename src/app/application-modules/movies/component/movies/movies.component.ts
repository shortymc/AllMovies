import { Subject } from 'rxjs/Subject';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DropboxService } from './../../../../service/dropbox.service';
import { Movie } from './../../../../model/movie';
import { MovieService } from './../../../../service/movie.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Sort } from '@angular/material/sort';

const init_columns = ['id', 'thumbnail', 'title', 'original_title', 'date', 'note', 'language', 'genres', 'time'];

@Component({
  selector: 'app-my-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  displayedColumns = init_columns;
  movies: Movie[];
  sortedData: Subject<Movie[]> = new Subject<Movie[]>();
  public tableWidget: any;
  constructor(private movieService: MovieService, private router: Router, private breakpointObserver: BreakpointObserver,
    private dropboxService: DropboxService, private translate: TranslateService, private mediaMatcher: MediaMatcher) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 700px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = ['thumbnail', 'title', 'date', 'language', 'time'];
      } else {
        this.displayedColumns = init_columns;
      }
    });
    this.getMovies();
  }

  getMovies(): void {
    this.dropboxService.getAllMovies('ex.json').then(movies => {
      this.movies = movies;
      this.sortedData.next(this.movies);
      this.checkAndFixData();
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction == '') {
      this.sortedData.next(this.movies);
      return;
    }
    console.log('sort');
    console.log(sort);

    this.sortedData.next(this.movies.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      // Date
      // Durée
      switch (sort.active) {
        case 'id':
          return this.compare(+a.id, +b.id, isAsc);
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'original_title':
          return this.compare(a.original_title, b.original_title, isAsc);
        case 'note':
          return this.compare(+a.note, +b.note, isAsc);
        case 'language':
          return this.compare(a.language, b.language, isAsc);
        default:
          return 0;
      }
    }));
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
    incomplete = incomplete.slice(0, 20);
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
    // this.dropboxService.removeMovie(id, 'ex.json');
    // tableWidget.row(tr).remove();
    // tableWidget.draw();
  }

}
