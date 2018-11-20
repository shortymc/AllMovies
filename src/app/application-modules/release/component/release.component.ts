import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, Injectable, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbDatepickerI18n, NgbDatepickerConfig, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { faChevronCircleRight, faBookmark } from '@fortawesome/free-solid-svg-icons';

import { Movie } from '../../../model/movie';
import { MovieService, TitleService } from '../../../shared/shared.module';
import { MyNgbDate } from '../../../shared/my-ngb-date';
import { DuckDuckGo } from '../../../constant/duck-duck-go';

const now: Date = new Date();

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

  getDayAriaLabel(date: NgbDateStruct): string {
    return date.day + '/' + date.month + '/' + date.year;
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
  @ViewChild('dp') dp: NgbDatepicker;
  movies: Movie[];
  selectedMovie: Movie;
  model: NgbDateStruct;
  monday: Date;
  sunday: Date;
  Url = DuckDuckGo;
  language: string;

  faChevronCircleRight = faChevronCircleRight;
  faBookmark = faBookmark;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private formatter: MyNgbDate,
    config: NgbDatepickerConfig,
    private translate: TranslateService,
    private title: TitleService,
    private elemRef: ElementRef,
  ) {
    // Other days than wednesday are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() !== 3;
    };
  }

  ngOnInit(): void {
    this.title.setTitle('title.release');
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.getMoviesByReleaseDates();
      if (this.selectedMovie) {
        this.onSelect(this.selectedMovie);
      }
    });
    this.route.queryParams.subscribe(
      params => {
        const date = params.date;
        if (date === null || date === undefined) {
          this.selectPreviousWednesday();
        } else {
          this.dp.startDate = this.selectDate(date);
        }
        this.getMoviesByReleaseDates();
      }
    );
  }

  navigate(day: string): void {
    this.model = this.formatter.parse(day);
    this.dp.navigateTo(this.model);
    this.selectedMovie = undefined;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        date: day
      }
    });
  }

  getMoviesByReleaseDates(): void {
    if (this.model !== null && this.model !== undefined) {
      this.monday = this.formatter.getPreviousMonday(this.model);
      this.sunday = this.formatter.getFollowingSunday(this.model);
      this.movieService.getMoviesByReleaseDates(this.formatter.dateToString(this.monday, 'yyyy-MM-dd'),
        this.formatter.dateToString(this.sunday, 'yyyy-MM-dd'), this.language)
        .then(movies => this.movies = movies);
    }
  }

  selectPreviousWednesday(): NgbDateStruct {
    const date = now;
    date.setDate(date.getDate() - (date.getDay() + 4) % 7);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.model;
  }

  selectDate(date: string): NgbDateStruct {
    this.model = this.formatter.parse(date);
    return this.model;
  }

  addDays(days: number): string {
    let date = this.formatter.ngbDateToDate(this.model);
    date = this.formatter.addNgbDays(this.model, days);
    return this.formatter.dateToString(date, 'dd/MM/yyyy');
  }

  parseDate(): string {
    const date = this.formatter.ngbDateToDate(this.model);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.formatter.dateToString(date, 'dd/MM/yyyy');
  }

  onSelect(movie: Movie): void {
    this.movieService.getMovie(movie.id, false, true, false, false, false, false, true, this.language).subscribe(selectedMovie => {
      this.selectedMovie = selectedMovie;
      this.elemRef.nativeElement.querySelector('#selectedMovie').scrollIntoView();
    });
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
