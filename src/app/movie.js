"use strict";
var Movie = (function () {
    function Movie(id, title, date, synopsis, affiche) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.synopsis = synopsis;
        this.affiche = affiche;
    }
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=movie.js.map