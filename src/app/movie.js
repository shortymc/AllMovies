"use strict";
var Movie = (function () {
    function Movie(id, title, original_title, date, synopsis, affiche, thumbnail, adult, time, note, budget, recette, videos, actors, crew, recommendations) {
        this.id = id;
        this.title = title;
        this.original_title = original_title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.thumbnail = thumbnail;
        this.adult = adult;
        this.time = time;
        this.note = note;
        this.videos = videos;
        this.actors = actors;
        this.crew = crew;
        this.budget = budget;
        this.recette = recette;
        this.recommendations = recommendations;
    }
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=movie.js.map