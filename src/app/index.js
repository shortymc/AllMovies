"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var star_rating_component_1 = require("./star-rating.component");
var star_rating_config_1 = require("./star-rating-config");
__export(require("./star-rating.component"));
__export(require("./star-rating-config"));
__export(require("./star-rating-struct"));
var EXPORTS = [star_rating_component_1.StarRatingComponent];
var StarRatingModule = StarRatingModule_1 = (function () {
    function StarRatingModule() {
    }
    StarRatingModule.forRoot = function () {
        return {
            ngModule: StarRatingModule_1,
            providers: [star_rating_config_1.StarRatingConfig]
        };
    };
    return StarRatingModule;
}());
StarRatingModule = StarRatingModule_1 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [EXPORTS],
        declarations: [EXPORTS]
    })
], StarRatingModule);
exports.StarRatingModule = StarRatingModule;
var StarRatingModule_1;
//# sourceMappingURL=index.js.map