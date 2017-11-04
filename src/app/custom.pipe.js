"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var ConvertToHHmmPipe = (function () {
    function ConvertToHHmmPipe() {
    }
    ConvertToHHmmPipe.prototype.transform = function (minutes) {
        var result = "";
        result += Math.floor(minutes / 60) + " heures ";
        result += minutes % 60 + " minutes";
        return result;
    };
    return ConvertToHHmmPipe;
}());
ConvertToHHmmPipe = __decorate([
    core_1.Pipe({ name: 'convertToHHmm' })
], ConvertToHHmmPipe);
exports.ConvertToHHmmPipe = ConvertToHHmmPipe;
var CapitalizeWordPipe = (function () {
    function CapitalizeWordPipe() {
    }
    CapitalizeWordPipe.prototype.transform = function (str) {
        str = str.replace(/([^\W_]+[^\s-]*) */g, function (s) {
            return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
        });
        return str;
    };
    return CapitalizeWordPipe;
}());
CapitalizeWordPipe = __decorate([
    core_1.Pipe({ name: 'capitalizeWord' })
], CapitalizeWordPipe);
exports.CapitalizeWordPipe = CapitalizeWordPipe;
var FilterCrewPipe = (function () {
    function FilterCrewPipe() {
    }
    FilterCrewPipe.prototype.transform = function (str, args) {
        return str.filter(function (h) { return h.job.toLowerCase() == args.toLowerCase(); }).map(function (s) { return s.name; }).join(', ');
    };
    return FilterCrewPipe;
}());
FilterCrewPipe = __decorate([
    core_1.Pipe({ name: 'filterCrew' })
], FilterCrewPipe);
exports.FilterCrewPipe = FilterCrewPipe;
//# sourceMappingURL=custom.pipe.js.map