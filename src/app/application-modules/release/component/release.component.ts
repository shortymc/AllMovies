import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, Injectable, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbDatepickerI18n, NgbDatepickerConfig, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { Movie } from '../../../model/movie';
import { MovieService, TitleService } from '../../../shared/shared.module';
import { MyNgbDate } from '../../../shared/my-ngb-date';
import { DuckDuckGo } from '../../../constant/duck-duck-go';
import { DetailConfig } from '../../../model/model';

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
export class ReleaseComponent implements OnInit, OnDestroy {
  @ViewChild('dp', { static: true }) dp: NgbDatepicker;
  movies: Movie[];
  selectedId: number;
  model: NgbDateStruct;
  monday: Date;
  sunday: Date;
  language: string;
  config: DetailConfig;
  subs = [];

  Url = DuckDuckGo;

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
    this.config = new DetailConfig(true, true, false, false, false, false, true, false, false, this.language);
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.getMoviesByReleaseDates();
    }));
    this.route.queryParams.subscribe(
      params => {
        const date = params.date;
        if (date === null || date === undefined) {
          this.selectPreviousWednesday();
        } else {
          this.dp.startDate = this.selectDate(date);
        }
        if (params.selected) {
          this.selectedId = parseInt(params.selected, 10);
        }
        if (!this.movies) {
          this.getMoviesByReleaseDates();
        }
      }
    );
  }

  navigate(day: string): void {
    this.model = this.formatter.parse(day);
    this.dp.navigateTo(this.model);
    this.selectedId = undefined;
    this.movies = undefined;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        date: day,
        selected: undefined
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
    return this.formatter.dateToString(this.formatter.addNgbDays(this.model, days), 'dd/MM/yyyy');
  }

  parseDate(): string {
    const date = this.formatter.ngbDateToDate(this.model);
    this.model = this.formatter.dateToNgbDateStruct(date);
    return this.formatter.dateToString(date, 'dd/MM/yyyy');
  }

  onSelect(movie: Movie): void {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        date: this.parseDate(),
        selected: movie.id
      }
    });
  }

  onLoaded(): void {
    setTimeout(() => {
      const selected = this.elemRef.nativeElement;
      if (selected.offsetWidth < 700) {
        selected.querySelector('.selectedId').scrollIntoView();
      } else {
        this.elemRef.nativeElement.scrollIntoView();
      }
    }, 500);
  }

  isInfo(movie: Movie): boolean {
    return movie.vote_count > 10 && (movie.popularity >= 40 || movie.vote_count >= 100) && !this.isSuccess(movie) && !this.isDanger(movie);
  }

  isSuccess(movie: Movie): boolean {
    return movie.vote >= 7 && movie.vote_count >= 10;
  }

  isDanger(movie: Movie): boolean {
    return movie.vote < 5 && movie.vote_count >= 10;
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
