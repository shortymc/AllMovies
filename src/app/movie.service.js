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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var movie_1 = require("./movie");
var MovieService = (function () {
    function MovieService(http) {
        this.http = http;
        this.moviesUrl = 'api/movies'; // URL to web api
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
        this.movieUrl = 'https://api.themoviedb.org/3/movie';
        this.langue = '&language=fr';
        this.append = '&append_to_response=';
        this.videos = 'videos';
        this.credits = 'credits';
        this.mostPopular = 'https://api.themoviedb.org/3/discover/movie?api_key=81c50d6514fbd578f0c796f8f6ecdafd&sort_by=popularity.desc';
    }
    MovieService.prototype.getMovies = function () {
        var _this = this;
        return this.http.get(this.mostPopular)
            .toPromise()
            .then(function (response) { return _this.mapMovies(response); })
            .catch(this.handleError);
    };
    MovieService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    MovieService.prototype.getMovie = function (id) {
        var _this = this;
        var url = this.movieUrl + "/" + id + "?" + this.api_key + this.langue + this.append + this.videos + "," + this.credits;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return _this.mapMovie(response); })
            .catch(this.handleError);
    };
    MovieService.prototype.update = function (movie) {
        var url = this.moviesUrl + "/" + movie.id;
        return this.http
            .put(url, JSON.stringify(movie), { headers: this.headers })
            .toPromise()
            .then(function () { return movie; })
            .catch(this.handleError);
    };
    MovieService.prototype.create = function (title) {
        return this.http
            .post(this.moviesUrl, JSON.stringify({ title: title }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    MovieService.prototype.delete = function (id) {
        var url = this.moviesUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function () { return null; })
            .catch(this.handleError);
    };
    MovieService.prototype.mapMovies = function (response) {
        return response.json().results.map(function (r) { return ({
            id: r.id,
            title: r.title,
            date: r.release_date
        }); });
    };
    MovieService.prototype.mapMovie = function (response) {
        // The response of the API has a results
        // property with the actual results
        var r = response.json();
        var cast = r.credits.cast.sort(function (a1, a2) {
            if (a1.cast_id < a2.cast_id) {
                return -1;
            }
            else if (a1.cast_id > a2.cast_id) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return new movie_1.Movie(r.id, r.title, r.release_date, r.overview, r.poster_path, false, r.videos.results, cast.slice(0, 6));
    };
    return MovieService;
}());
MovieService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], MovieService);
exports.MovieService = MovieService;
//# sourceMappingURL=movie.service.js.map