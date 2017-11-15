import { Component, Injectable, OnInit } from '@angular/core';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { Router } from '@angular/router';
import {NgbDateStruct, NgbDatepickerI18n, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { MyNgbDate } from "./my-ngb-date";

const now = new Date();

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'F�v', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'D�c'],
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
    selector: 'release',
    templateUrl: './release.component.html',
    styleUrls: ['./release.component.css'],
    providers: [I18n, NgbDatepickerConfig, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ReleaseComponent {
    movies: Movie[];
    selectedMovie: Movie;
    model: NgbDateStruct;
    date: {year: number, month: number};
    monday: Date;
    sunday: Date;
    private preview = "https://image.tmdb.org/t/p/w92";
    private original = "https://image.tmdb.org/t/p/original";
    score: string;

    constructor(private movieService: MovieService, private router: Router, 
        private formatter: MyNgbDate, config: NgbDatepickerConfig) { 
    	// Other days than wednesday are disabled
        config.markDisabled = (date: NgbDateStruct) => {
          const d = new Date(date.year, date.month - 1, date.day);
          return d.getDay() !== 3;
        };
    }

    getMovies(): void {
        this.movieService.getMovies().then(movies => this.movies = movies);
    }
    meta(title: string): void {
        this.score = this.movieService.getMetaScore(title);
    }
    getMoviesByReleaseDates(): void { 
        if(this.model !== null && this.model !== undefined) {
        	this.monday = this.formatter.getPreviousMonday(this.model);
        	this.sunday = this.formatter.getFollowingSunday(this.model);
            this.movieService.getMoviesByReleaseDates(this.formatter.dateToString(this.monday, 'yyyy-MM-dd'), this.formatter.dateToString(this.sunday, 'yyyy-MM-dd'))
            .then(movies => this.movies = movies);
        }
    }
    selectPreviousWednesday(): NgbDateStruct {
    	let date = now;
    	date.setDate(date.getDate() - (date.getDay() + 4) % 7);
        this.model = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
        return this.model;
    }
    ngOnInit(): void {
    	this.selectPreviousWednesday(); 
    	this.getMoviesByReleaseDates();
    }
    onSelect(movie: Movie): void {
//        this.selectedMovie = movie;
         this.movieService.getMovie(movie.id, false, true, false, false).then(movie => this.selectedMovie = movie);
    };
    gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedMovie.id]);
    }
    
    gotoPerson(person: any): void {
        let link = ['/person', person.id];
        this.router.navigate(link);
    }
}