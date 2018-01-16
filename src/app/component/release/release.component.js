"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const movie_service_1 = require("../../movie.service");
const dropbox_service_1 = require("../../dropbox.service");
const router_1 = require("@angular/router");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const my_ngb_date_1 = require("../../my-ngb-date");
const now = new Date();
const I18N_VALUES = {
    'fr': {
        weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        months: ['Jan', 'F�v', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'D�c'],
    }
};
let I18n = class I18n {
    constructor() {
        this.language = 'fr';
    }
};
I18n = __decorate([
    core_1.Injectable()
], I18n);
exports.I18n = I18n;
let CustomDatepickerI18n = class CustomDatepickerI18n extends ng_bootstrap_1.NgbDatepickerI18n {
    constructor(_i18n) {
        super();
        this._i18n = _i18n;
    }
    getWeekdayShortName(weekday) {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    }
    getMonthShortName(month) {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    }
    getMonthFullName(month) {
        return this.getMonthShortName(month);
    }
};
CustomDatepickerI18n = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [I18n])
], CustomDatepickerI18n);
exports.CustomDatepickerI18n = CustomDatepickerI18n;
let ReleaseComponent = class ReleaseComponent {
    constructor(movieService, router, formatter, config, dropboxService) {
        this.movieService = movieService;
        this.router = router;
        this.formatter = formatter;
        this.dropboxService = dropboxService;
        this.preview = 'https://image.tmdb.org/t/p/w92';
        this.original = 'https://image.tmdb.org/t/p/original';
        // Other days than wednesday are disabled
        config.markDisabled = (date) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() !== 3;
        };
    }
    getMovies() {
        this.movieService.getMovies().then(movies => this.movies = movies);
    }
    meta(title) {
        //        this.score = this.movieService.getMetaScore(title);
        //        let theJSON = JSON.stringify({'foo':'bar'});
        //        this.dropboxService.listFiles();
        this.dropboxService.addMovie(this.selectedMovie, 'ex.json');
    }
    getMoviesByReleaseDates() {
        if (this.model !== null && this.model !== undefined) {
            this.monday = this.formatter.getPreviousMonday(this.model);
            this.sunday = this.formatter.getFollowingSunday(this.model);
            this.movieService.getMoviesByReleaseDates(this.formatter.dateToString(this.monday, 'yyyy-MM-dd'), this.formatter.dateToString(this.sunday, 'yyyy-MM-dd'))
                .then(movies => this.movies = movies);
        }
    }
    selectPreviousWednesday() {
        let date = now;
        date.setDate(date.getDate() - (date.getDay() + 4) % 7);
        this.model = this.formatter.dateToNgbDateStruct(date);
        return this.model;
    }
    removeOneWeek() {
        let date = this.formatter.addNgbDays(this.model, -7);
        this.model = this.formatter.dateToNgbDateStruct(date);
        return this.model;
    }
    addOneWeek() {
        let date = this.formatter.addNgbDays(this.model, 7);
        this.model = this.formatter.dateToNgbDateStruct(date);
        return this.model;
    }
    ngOnInit() {
        this.selectPreviousWednesday();
        this.getMoviesByReleaseDates();
    }
    onSelect(movie) {
        //        this.selectedMovie = movie;
        this.movieService.getMovie(movie.id, false, true, false, false).then(movie => {
            this.selectedMovie = movie;
            let title = this.selectedMovie.title;
            let original = this.selectedMovie.original_title;
            let searchTitle = original === '' ? title : original;
            this.movieService.getLinkScore(searchTitle, 'metacritic').then(result => this.metacritic = result);
            this.movieService.getLinkScore(searchTitle, 'scq').then(result => this.senscritique = result);
            this.movieService.getLinkScore(searchTitle, 'imdb').then(result => this.imdb = result);
            this.movieService.getLinkScore(searchTitle, 'wen').then(result => this.wikiEN = result);
            this.movieService.getLinkScore(searchTitle, 'wikifr').then(result => this.wikiFR = result);
        });
    }
    ;
    openAll() {
        window.open(this.metacritic);
        window.open(this.senscritique);
        window.open(this.wikiEN);
        window.open(this.wikiFR);
    }
    gotoDetail() {
        this.router.navigate(['/detail', this.selectedMovie.id]);
    }
    gotoPerson(person) {
        let link = ['/person', person.id];
        this.router.navigate(link);
    }
};
ReleaseComponent = __decorate([
    core_1.Component({
        selector: 'release',
        templateUrl: './release.component.html',
        styleUrls: ['./release.component.css'],
        providers: [I18n, ng_bootstrap_1.NgbDatepickerConfig, { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
    }),
    __metadata("design:paramtypes", [movie_service_1.MovieService, router_1.Router,
        my_ngb_date_1.MyNgbDate, ng_bootstrap_1.NgbDatepickerConfig, dropbox_service_1.DropboxService])
], ReleaseComponent);
exports.ReleaseComponent = ReleaseComponent;
//# sourceMappingURL=release.component.js.map