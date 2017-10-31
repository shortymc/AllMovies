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
var core_1 = require("@angular/core");
var movie_service_1 = require("./movie.service");
var router_1 = require("@angular/router");
var MoviesComponent = (function () {
    function MoviesComponent(movieService, router) {
        this.movieService = movieService;
        this.router = router;
    }
    MoviesComponent.prototype.getMovies = function () {
        var _this = this;
        this.movieService.getMovies().then(function (movies) { return _this.movies = movies; });
    };
    MoviesComponent.prototype.ngOnInit = function () {
        this.getMovies();
    };
    MoviesComponent.prototype.onSelect = function (movie) {
        this.selectedMovie = movie;
    };
    ;
    MoviesComponent.prototype.gotoDetail = function () {
        this.router.navigate(['/detail', this.selectedMovie.id]);
    };
    MoviesComponent.prototype.add = function (name) {
        var _this = this;
        name = name.trim();
        if (!name) {
            return;
        }
        this.movieService.create(name)
            .then(function (movie) {
            _this.movies.push(movie);
            _this.selectedMovie = null;
        });
    };
    MoviesComponent.prototype.delete = function (movie) {
        var _this = this;
        this.movieService
            .delete(movie.id)
            .then(function () {
            _this.movies = _this.movies.filter(function (h) { return h !== movie; });
            if (_this.selectedMovie === movie) {
                _this.selectedMovie = null;
            }
        });
    };
    return MoviesComponent;
}());
MoviesComponent = __decorate([
    core_1.Component({
        selector: 'my-movies',
        templateUrl: './movies.component.html',
        styleUrls: ['./movies.component.css']
    }),
    __metadata("design:paramtypes", [movie_service_1.MovieService, router_1.Router])
], MoviesComponent);
exports.MoviesComponent = MoviesComponent;
//# sourceMappingURL=movies.component.js.map