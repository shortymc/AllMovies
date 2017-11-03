"use strict";
var StarRatingUtils = (function () {
    function StarRatingUtils() {
    }
    //Static methods
    ///////////////////////////////////////////////////////////////////////////////////////////
    /**
     * getStarsArray
     *
     * returns an array of increasing numbers starting at 1
     *
     * @param numOfStars
     * @returns {Array}
     */
    StarRatingUtils.getStarsArray = function (numOfStars) {
        var stars = [];
        for (var i = 0; i < numOfStars; i++) {
            stars.push(i + 1);
        }
        return stars;
    };
    /**
     * getHalfStarVisible
     *
     * Returns true if there should be a half star visible, and false if not.
     *
     * @param rating
     * @returns {boolean}
     */
    StarRatingUtils.getHalfStarVisible = function (rating) {
        return Math.abs(rating % 1) > 0;
    };
    /**
     * getColor
     *
     * The default function for color calculation
     * based on the current rating and the the number of stars possible.
     * If a staticColor is set the function will use it as return value.
     *
     * @param rating
     * @param numOfStars
     * @param staticColor
     * @returns {starRatingColor}
     */
    StarRatingUtils.getColor = function (rating, numOfStars, staticColor) {
        rating = rating || 0;
        //if a fix color is set use this one
        if (staticColor) {
            return staticColor;
        }
        //calculate size of smallest fraction
        var fractionSize = numOfStars / 3;
        //apply color by fraction
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
    return StarRatingUtils;
}());
/**
 * isDigitKeyEventCode
 * detects digit key event sodes
 * @param eventCode
 * @returns {boolean}
 */
StarRatingUtils.isDigitKeyEventCode = function (eventCode) {
    return eventCode.indexOf('Digit') === 0;
};
exports.StarRatingUtils = StarRatingUtils;
//# sourceMappingURL=star-rating.utils.js.map