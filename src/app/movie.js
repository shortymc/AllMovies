"use strict";
var Movie = (function () {
    function Movie(id, title, date, synopsis, affiche, adult, videos) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
        this.adult = adult;
        this.videos = videos;
    }
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=movie.js.map