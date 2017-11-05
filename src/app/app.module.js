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
var person_detail_component_1 = require("./person-detail.component");
var movies_component_1 = require("./movies.component");
var dashboard_component_1 = require("./dashboard.component");
var movie_service_1 = require("./movie.service");
var person_service_1 = require("./person.service");
var movie_search_component_1 = require("./movie-search.component");
var custom_pipe_1 = require("./custom.pipe");
var ngx_rating_1 = require("ngx-rating");
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
            ngx_rating_1.RatingModule,
            app_routing_module_1.AppRoutingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            dashboard_component_1.DashboardComponent,
            custom_pipe_1.ConvertToHHmmPipe,
            custom_pipe_1.CapitalizeWordPipe,
            custom_pipe_1.FilterCrewPipe,
            movie_detail_component_1.MovieDetailComponent,
            movies_component_1.MoviesComponent,
            person_detail_component_1.PersonDetailComponent,
            movie_search_component_1.MovieSearchComponent
        ],
        providers: [movie_service_1.MovieService, person_service_1.PersonService,
            { provide: core_1.LOCALE_ID, useValue: "fr" }],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map