"use strict";
var Person = (function () {
    function Person(id, name, birthday, deathday, profile, thumbnail, biography, adult) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.deathday = deathday;
        this.profile = profile;
        this.adult = adult;
        this.thumbnail = thumbnail;
        this.biography = biography;
    }
    return Person;
}());
exports.Person = Person;
//# sourceMappingURL=person.js.map