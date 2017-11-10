import { Component, Injectable } from '@angular/core';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { Router } from '@angular/router';
import {NgbDateStruct, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { MyNgbDate } from "./my-ngb-date";

const now = new Date();

@Component({
    selector: 'release',
    templateUrl: './release.component.html',
    styleUrls: ['./release.component.css',
//    providers: [I18n, {provide: ReleaseComponent, useClass: CustomDatepickerI18n}]
})
export class ReleaseComponent {
    movies: Movie[];
    selectedMovie: Movie;
    model: NgbDateStruct;
    date: {year: number, month: number};

    constructor(private movieService: MovieService, private router: Router, 
        private formatter: MyNgbDate) { 
        this.selectToday(); 
        this.getMoviesByReleaseDates();
    }

    getMovies(): void {
        this.movieService.getMovies().then(movies => this.movies = movies);
    }
    getMoviesByReleaseDates(): void { 
        console.log(this.model);
        if(this.model !== null && this.model !== undefined) {
            let debut = this.formatter.format(this.model); 
            let fin = new Date(debut+'T00:00:00');
            fin.setDate( fin.getDate() + 6 );
            let finString = this.formatter.dateToString(fin, 'yyyy-MM-dd');
            this.movieService.getMoviesByReleaseDates(debut, finString).then(movies => this.movies = movies);
        }
    }
    selectToday() {
        this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    }
    ngOnInit(): void {
    }
    onSelect(movie: Movie): void {
        this.selectedMovie = movie;
    };
    gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedMovie.id]);
    }
}

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