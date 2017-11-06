"use strict";
/**
 * Configuration service for the StarRating component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the star ratings used in the application.
 */
var StarRatingConfig = (function () {
    function StarRatingConfig() {
        this.classEmpty = "default-star-empty-icon";
        this.classHalf = "default-star-half-icon";
        this.classFilled = "default-star-filled-icon";
        this.numOfStars = 5;
        this.size = "medium";
        this.speed = "noticeable";
        this.labelPosition = "left";
        this.starType = "svg";
        this.assetsPath = "./app/img/";
        this.svgPath = this.assetsPath + "star-rating.icons.svg";
        this.svgEmptySymbolId = "star-empty";
        this.svgHalfSymbolId = "star-half";
        this.svgFilledSymbolId = "star-filled";
        this.svgPathEmpty = this.svgPath + "#" + this.svgEmptySymbolId;
        this.svgPathHalf = this.svgPath + "#" + this.svgHalfSymbolId;
        this.svgPathFilled = this.svgPath + "#" + this.svgFilledSymbolId;
    }
    StarRatingConfig.prototype.getColor = function (rating, numOfStars, staticColor) {
        rating = rating || 0;
        // if a fix color is set use this one
        if (staticColor) {
            return staticColor;
        }
        // calculate size of smallest fraction
        var fractionSize = numOfStars / 3;
        // apply color by fraction
        var color = 'default';
        if (rating > 0) {
            color = 'negative';
        }
        if (rating > fractionSize) {
            color = 'ok';
        }
        if (rating > fractionSize * 2) {
            color = 'positive';
        }
        return color;
    };
    StarRatingConfig.prototype.getHalfStarVisible = function (rating) {
        return Math.abs(rating % 1) > 0;
    };
    return StarRatingConfig;
}());
exports.StarRatingConfig = StarRatingConfig;
//# sourceMappingURL=star-rating-config.js.map