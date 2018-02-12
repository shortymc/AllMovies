import { Component, Injectable, OnInit } from '@angular/core';
import { Movie } from '../../model/movie';
import { MovieService } from '../../service/movie.service';
import { DropboxService } from '../../service/dropbox.service';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbDatepickerI18n, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MyNgbDate } from '../../Shared/my-ngb-date';
import { Url } from '../../constant/url';

const now = new Date();

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  }
};

@Injectable()
export class I18n {
  language = 'fr';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css'],
  providers: [I18n, NgbDatepickerConfig, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class ReleaseComponent implements OnInit {
  movies: Movie[];
  selectedMovie: Movie;
  model: NgbDateStruct;
  date: { year: number, month: number };
  monday: Date;
  sunday: Date;
  Url = Url;
  score: string;
  metacritic: string;
  senscritique: string;
  imdb: string;
  wikiEN: string;
  wikiFR: string;
  res: Movie[];

  constructor(private movieService: MovieService, private router: Router,
    private formatter: MyNgbDate, config: NgbDatepickerConfig, private dropboxService: DropboxService) {
    // Other days than wednesday are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() !== 3;
    };
  }
  ngOnInit(): void {
    this.selectPreviousWednesday();
    this.getMoviesByReleaseDates();
  }
  getMovies(): void {
    this.movieService.getMovies().then(movies => this.movies = movies);
  }
  meta(title: string): void {
    //        this.score = this.movieService.getMetaScore(title);
    //        let theJSON = JSON.stringify({'foo':'bar'});
    //        this.dropboxService.listFiles();
    this.dropboxService.addMovie(this.selectedMovie, 'ex.json');
  }

  getMoviesByReleaseDates(): void {
    if (this.model !== null && this.model !== undefined) {
      this.monday = this.formatter.getPreviousMonday(this.model);
      this.sunday = this.formatter.getFollowingSunday(this.model);
      this.movieService.getMoviesByReleaseDates(this.formatter.dateToString(this.monday, 'yyyy-MM-dd'),
        this.formatter.dateToString(this.sunday, 'yyyy-MM-dd'))
        .then(movies => this.movies = movies);
    }
  }
  selectPreviousWednesday(): NgbDateStruct {
    const date = now;
    date.setDate(date.getDate() - (date.getDay() + 4) % 7);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.model;
  }
  removeOneWeek(): NgbDateStruct {
    const date = this.formatter.addNgbDays(this.model, -7);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.model;
  }
  addOneWeek(): NgbDateStruct {
    const date = this.formatter.addNgbDays(this.model, 7);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.model;
  }
  onSelect(movie: Movie): void {
    //        this.selectedMovie = movie;
    this.movieService.getMovie(movie.id, false, true, false, false).then(selectedMovie => {
      this.selectedMovie = selectedMovie;
      const title = this.selectedMovie.title;
      const original = this.selectedMovie.original_title;
      const searchTitle = original === '' ? title : original;
      this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_METACRITIC).then(result => this.metacritic = result);
      this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_SENSCRITIQUE).then(result => this.senscritique = result);
      this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_IMDB).then(result => this.imdb = result);
      this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_WIKI_EN).then(result => this.wikiEN = result);
      this.movieService.getLinkScore(searchTitle, Url.SEARCH_BANG_WIKI_FR).then(result => this.wikiFR = result);
    });
  }
  openAll(): void {
    window.open(this.metacritic);
    window.open(this.senscritique);
    window.open(this.wikiEN);
    window.open(this.wikiFR);
  }
  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedMovie.id]);
  }

  gotoPerson(person: any): void {
    const link = ['/person', person.id];
    this.router.navigate(link);
  }
}
