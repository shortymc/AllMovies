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
  styleUrls: ['./release.component.scss'],
  providers: [I18n, NgbDatepickerConfig, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class ReleaseComponent implements OnInit {
  movies: Movie[];
  selectedMovie: Movie;
  model: NgbDateStruct;
  monday: Date;
  sunday: Date;
  Url = Url;

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
    this.movieService.getMovie(movie.id, false, true, false, false).then(selectedMovie => {
      this.selectedMovie = selectedMovie;
    });
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedMovie.id]);
  }

  gotoPerson(person: any): void {
    const link = ['/person', person.id];
    this.router.navigate(link);
  }

  isInfo(movie: Movie): boolean {
    return movie.vote_count > 10 && (movie.popularity >= 40 || movie.vote_count >= 100) && !this.isSuccess(movie) && !this.isDanger(movie);
  }

  isSuccess(movie: Movie): boolean {
    return movie.note >= 7 && movie.vote_count >= 10;
  }

  isDanger(movie: Movie): boolean {
    return movie.note < 5 && movie.vote_count >= 10;
  }
}
