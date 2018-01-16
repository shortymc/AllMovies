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
const router_1 = require("@angular/router");
const common_1 = require("@angular/common");
require("rxjs/add/operator/switchMap");
const movie_service_1 = require("../../movie.service");
const dropbox_service_1 = require("../../dropbox.service");
let MovieDetailComponent = class MovieDetailComponent {
    constructor(movieService, route, location, router, dropboxService) {
        this.movieService = movieService;
        this.route = route;
        this.location = location;
        this.router = router;
        this.dropboxService = dropboxService;
        this.original = 'https://image.tmdb.org/t/p/original';
        this.thumb = 'https://image.tmdb.org/t/p/w154';
        this.preview = 'https://image.tmdb.org/t/p/w92';
        this.isImagesCollapsed = false;
    }
    ngOnInit() {
        this.route.paramMap
            .switchMap((params) => this.movieService.getMovie(+params.get('id'), true, true, true, true))
            .subscribe(movie => {
            this.movie = movie;
            let title = this.movie.title;
            let original = this.movie.original_title;
            let searchTitle = original === '' ? title : original;
            this.movieService.getLinkScore(searchTitle, 'metacritic').then(result => this.metacritic = result);
            this.movieService.getLinkScore(searchTitle, 'scq').then(result => this.senscritique = result);
            this.movieService.getLinkScore(searchTitle, 'imdb').then(result => this.imdb = result);
            this.movieService.getLinkScore(searchTitle, 'wen').then(result => this.wikiEN = result);
            this.movieService.getLinkScore(searchTitle, 'wikifr').then(result => this.wikiFR = result);
        });
    }
    goBack() {
        let back = this.location.back();
        if (back === undefined) {
            this.router.navigate(['/']);
        }
    }
    openAll() {
        window.open(this.metacritic);
        window.open(this.senscritique);
        window.open(this.wikiEN);
        window.open(this.wikiFR);
    }
    save() {
        this.movieService.update(this.movie)
            .then(() => this.goBack());
    }
    add(movie) {
        this.dropboxService.addMovie(movie, 'ex.json');
    }
    addList() {
        this.dropboxService.addMovieList(this.movie.recommendations.filter((reco) => reco.checked), 'ex.json');
    }
};
MovieDetailComponent = __decorate([
    core_1.Component({
        selector: 'movie-detail',
        styleUrls: ['./movie-detail.component.css'],
        templateUrl: './movie-detail.component.html',
    }),
    __metadata("design:paramtypes", [movie_service_1.MovieService,
        router_1.ActivatedRoute,
        common_1.Location,
        router_1.Router,
        dropbox_service_1.DropboxService])
], MovieDetailComponent);
exports.MovieDetailComponent = MovieDetailComponent;
//# sourceMappingURL=movie-detail.component.js.map