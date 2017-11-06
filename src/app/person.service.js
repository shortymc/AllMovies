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
var person_1 = require("./person");
var PersonService = (function () {
    function PersonService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
        this.personUrl = 'https://api.themoviedb.org/3/person';
        this.langue = '&language=fr';
        this.append = '&append_to_response=';
        this.videos = 'videos';
        this.credits = 'credits';
        this.recommendations = 'recommendations';
    }
    PersonService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    PersonService.prototype.getPerson = function (id) {
        var _this = this;
        var url = this.personUrl + "/" + id + "?" + this.api_key + this.langue;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return _this.mapPerson(response); })
            .catch(this.handleError);
    };
    PersonService.prototype.mapPerson = function (response) {
        var r = response.json();
        var profile_path = r.profile_path;
        var thumbnail = r.profile_path;
        if (profile_path === null) {
            profile_path = './app/img/empty.jpg';
            thumbnail = './app/img/empty.jpg';
        }
        else {
            profile_path = "https://image.tmdb.org/t/p/original/" + profile_path;
            thumbnail = "https://image.tmdb.org/t/p/w154/" + thumbnail;
        }
        return new person_1.Person(r.id, r.name, r.birthday, r.deathday, profile_path, thumbnail, r.biography, r.adult);
    };
    return PersonService;
}());
PersonService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map