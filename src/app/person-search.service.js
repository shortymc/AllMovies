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
require("rxjs/add/operator/map");
var PersonSearchService = (function () {
    function PersonSearchService(http) {
        this.http = http;
        this.api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
        this.personUrl = 'https://api.themoviedb.org/3/search/person?';
        this.langue = '&language=fr';
    }
    PersonSearchService.prototype.search = function (term) {
        return this.http
            .get(this.personUrl + this.api_key + ("&include_adult=true&query=" + term), { headers: this.getHeaders() })
            .map(this.mapPersons)
            .map(function (data) { return data.slice(0, 10); });
    };
    PersonSearchService.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    PersonSearchService.prototype.mapPersons = function (response) {
        // The response of the API has a results
        // property with the actual results
        return response.json().results.map(function (r) { return ({
            id: r.id,
            name: r.name,
            adult: r.adult
        }); });
    };
    return PersonSearchService;
}());
PersonSearchService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PersonSearchService);
exports.PersonSearchService = PersonSearchService;
//# sourceMappingURL=person-search.service.js.map