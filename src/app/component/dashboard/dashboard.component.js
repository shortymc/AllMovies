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
let DashboardComponent = class DashboardComponent {
    constructor(movieService) {
        this.movieService = movieService;
        this.movies = [];
        this.showMovie = false;
        this.showPerson = false;
    }
    ngOnInit() {
        this.movieService.getMovies()
            .then(movies => this.movies = movies.slice(0, 4));
    }
};
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'my-dashboard',
        styleUrls: ['./dashboard.component.css'],
        templateUrl: './dashboard.component.html'
    }),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map