"use strict";
var star_rating_config_1 = require("./star-rating-config");
var star_rating_utils_1 = require("./star-rating.utils");
var StarRating = (function () {
    function StarRating() {
        var config = new star_rating_config_1.StarRatingConfig();
        //set default ctrl props
        this.classEmpty = config.classEmpty;
        this.classHalf = config.classHalf;
        this.classFilled = config.classFilled;
        this.pathEmpty = config.svgPathEmpty;
        this.pathHalf = config.svgPathHalf;
        this.pathFilled = config.svgPathFilled;
        //set default Component Inputs
        if ('getColor' in config && typeof config.getColor === "function") {
            this.getColor = config.getColor;
        }
        if ('getHalfStarVisible' in config && typeof config.getHalfStarVisible === "function") {
            this.getHalfStarVisible = config.getHalfStarVisible;
        }
        this.numOfStars = config.numOfStars;
        this.rating = 0;
        this.step = 1;
    }
    Object.defineProperty(StarRating.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "focus", {
        get: function () {
            return this._focus;
        },
        set: function (value) {
            this._focus = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "labelText", {
        get: function () {
            return this._labelText;
        },
        set: function (value) {
            this._labelText = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "labelPosition", {
        get: function () {
            return this._labelPosition;
        },
        set: function (value) {
            this._labelPosition = value || this.config.labelPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "labelVisible", {
        get: function () {
            return this._labelVisible;
        },
        set: function (value) {
            this._labelVisible = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "hoverEnabled", {
        get: function () {
            return this._hoverEnabled;
        },
        set: function (value) {
            this._hoverEnabled = (value !== undefined) ? !!value : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "staticColor", {
        get: function () {
            return this._staticColor;
        },
        set: function (value) {
            this._staticColor = value || undefined;
            //update color.
            this.setColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value || undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "numOfStars", {
        get: function () {
            return this._numOfStars;
        },
        set: function (value) {
            this._numOfStars = (value > 0) ? value : this.config.numOfStars;
            //update stars array
            this.stars = star_rating_utils_1.StarRatingUtils.getStarsArray(this.numOfStars);
            //update color
            this.setColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "hoverRating", {
        get: function () {
            return this._hoverRating;
        },
        set: function (value) {
            this._hoverRating = (value > 0) ? value : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = value || this.config.speed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._size = value || this.config.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "starType", {
        get: function () {
            return this._starType;
        },
        set: function (value) {
            this._starType = value || this.config.starType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "readOnly", {
        get: function () {
            return this._readOnly;
        },
        set: function (value) {
            this._readOnly = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = !!value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "step", {
        get: function () {
            return this._step;
        },
        set: function (value) {
            this._step = (value > 0 ? value : 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StarRating.prototype, "rating", {
        get: function () {
            return this._rating;
        },
        set: function (value) {
            this.setRating(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * setRating
     * I use a setter function instead of a set method to enable overrides for this function.
     * @param value
     */
    StarRating.prototype.setRating = function (value) {
        //validate and apply newRating
        var newRating = 0;
        if (value >= 0
            && value <= this.numOfStars) {
            newRating = value;
        }
        //limit max value to max number of stars
        if (value > this.numOfStars) {
            newRating = this.numOfStars;
        }
        this._rating = newRating;
        //update ratingAsInteger. rating parsed to int for the value-[n] modifier
        this.ratingAsInteger = parseInt(this._rating.toString());
        //update halfStarsVisible
        this.setHalfStarVisible();
        //update calculated Color
        this.setColor();
    };
    Object.defineProperty(StarRating.prototype, "showHalfStars", {
        get: function () {
            return this._showHalfStars;
        },
        set: function (value) {
            this._showHalfStars = !!value;
            //update halfStarVisible
            this.setHalfStarVisible();
        },
        enumerable: true,
        configurable: true
    });
    StarRating.prototype.svgVisible = function () {
        return this.starType === "svg";
    };
    StarRating.prototype.interactionPossible = function () {
        return !this.readOnly && !this.disabled;
    };
    StarRating.prototype.setColor = function () {
        //check if custom function is given
        if (typeof this.getColor === "function") {
            this.color = this.getColor(this.rating, this.numOfStars, this.staticColor);
        }
        else {
            this.color = star_rating_utils_1.StarRatingUtils.getColor(this.rating, this.numOfStars, this.staticColor);
        }
    };
    StarRating.prototype.setHalfStarVisible = function () {
        //update halfStarVisible
        if (this.showHalfStars) {
            //check if custom function is given
            if (typeof this.getHalfStarVisible === "function") {
                this.halfStarVisible = this.getHalfStarVisible(this.rating);
            }
            else {
                this.halfStarVisible = star_rating_utils_1.StarRatingUtils.getHalfStarVisible(this.rating);
            }
        }
        else {
            this.halfStarVisible = false;
        }
    };
    StarRating.prototype.getComponentClassNames = function () {
        var classNames = [];
        classNames.push(this.rating ? 'value-' + this.ratingAsInteger : 'value-0');
        classNames.push(this.halfStarVisible ? 'half' : '');
        classNames.push(this.hoverEnabled ? 'hover' : '');
        var hoverRating = (this.hoverRating ? 'hover-' + this.hoverRating : 'hover-0');
        classNames.push(this.hoverEnabled ? hoverRating : '');
        classNames.push(this.space ? 'space-' + this.space : '');
        classNames.push(this.labelPosition ? 'label-' + this.labelPosition : '');
        classNames.push(this.color ? 'color-' + this.color : '');
        classNames.push(this.starType ? 'star-' + this.starType : '');
        classNames.push(this.speed);
        classNames.push(this.size);
        classNames.push(this.readOnly ? 'read-only' : '');
        classNames.push(this.disabled ? 'disabled' : '');
        classNames.push(this.direction ? 'direction-' + this.direction : '');
        return classNames.join(' ');
    };
    StarRating.prototype.increment = function () {
        //increment to next higher step
        var absDiff = Math.abs(this.rating % this.step);
        this.rating = this.rating + (absDiff > 0 ? this.step - absDiff : this.step);
    };
    StarRating.prototype.decrement = function () {
        //decrement to next lower step
        var absDiff = Math.abs(this.rating % this.step);
        this.rating = this.rating - (absDiff > 0 ? absDiff : this.step);
    };
    StarRating.prototype.reset = function () {
        this.rating = 0;
    };
    return StarRating;
}());
exports.StarRating = StarRating;
//# sourceMappingURL=star-rating.js.map