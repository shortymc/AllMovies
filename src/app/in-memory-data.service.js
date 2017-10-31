"use strict";
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var movies = [
            { id: 0, title: 'Zero', year: 2017 },
            { id: 11, title: 'Mr. Nice', year: 2016 },
            { id: 12, title: 'Narco', year: 1986 },
            { id: 13, title: 'Bombasto', year: 1963 },
            { id: 14, title: 'Celeritas', year: 2005 },
            { id: 15, title: 'Magneta', year: 2009 },
            { id: 16, title: 'RubberMan', year: 1999 },
            { id: 17, title: 'Dynama', year: 1975 },
            { id: 18, title: 'Dr IQ', year: 1986 },
            { id: 19, title: 'Magma', year: 1987 },
            { id: 20, title: 'Tornado', year: 1956 }
        ];
        return { movies: movies };
    };
    return InMemoryDataService;
}());
exports.InMemoryDataService = InMemoryDataService;
//# sourceMappingURL=in-memory-data.service.js.map