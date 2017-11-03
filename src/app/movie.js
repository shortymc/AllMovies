"use strict";
var Movie = (function () {
    function Movie(id, title, date, synopsis, affiche, thumbnail, adult, time, videos, actors) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.thumbnail = thumbnail;
        this.adult = adult;
        this.time = time;
        this.videos = videos;
        this.actors = actors;
    }
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=movie.js.map