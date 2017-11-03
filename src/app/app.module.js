"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var movie_detail_component_1 = require("./movie-detail.component");
var movies_component_1 = require("./movies.component");
var dashboard_component_1 = require("./dashboard.component");
var movie_service_1 = require("./movie.service");
var movie_search_component_1 = require("./movie-search.component");
var rating_component_1 = require("./rating.component");
var custom_pipe_1 = require("./custom.pipe");
//import { StarRatingComponent } from './star-rating.component';
var angular_star_rating_1 = require("angular-star-rating");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            common_1.CommonModule,
            angular_star_rating_1.StarRatingModule.forRoot(),
            app_routing_module_1.AppRoutingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            dashboard_component_1.DashboardComponent,
            custom_pipe_1.ConvertToHHmmPipe,
            movie_detail_component_1.MovieDetailComponent,
            //        StarRatingComponent,
            rating_component_1.RatingComponent,
            movies_component_1.MoviesComponent,
            movie_search_component_1.MovieSearchComponent
        ],
        exports: [rating_component_1.RatingComponent],
        providers: [movie_service_1.MovieService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map