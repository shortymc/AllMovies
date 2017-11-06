"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var star_rating_1 = require("./star-rating");
var forms_1 = require("@angular/forms");
var star_rating_utils_1 = require("./star-rating.utils");
var STAR_RATING_CONTROL_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return StarRatingComponent; }),
    multi: true
};
var StarRatingComponent = (function (_super) {
    __extends(StarRatingComponent, _super);
    function StarRatingComponent() {
        var _this = _super.call(this) || this;
        //Outputs
        ///////////////////////////////////////////////////////////////////////////////////////////
        _this.onClick = new core_1.EventEmitter();
        _this.onRatingChange = new core_1.EventEmitter();
        _this.onHoverRatingChange = new core_1.EventEmitter();
        _this.onModelChangeRegistered = false;
        _this.onTouchRegistered = false;
        return _this;
    }
    StarRatingComponent.prototype.saveOnClick = function ($event) {
        if (this.onClick) {
            this.onClick.emit($event);
        }
    };
    StarRatingComponent.prototype.saveOnRatingChange = function ($event) {
        if (this.onRatingChange) {
            this.onRatingChange.emit($event);
        }
    };
    StarRatingComponent.prototype.saveOnHover = function ($event) {
        if (this.onHoverRatingChange) {
            this.onHoverRatingChange.emit($event);
        }
    };
    StarRatingComponent.prototype.saveOnTouch = function () {
        if (this.onTouchRegistered) {
            this.onTouch();
        }
    };
    StarRatingComponent.prototype.saveOnModelChange = function (value) {
        if (this.onModelChangeRegistered) {
            this.onModelChange(value);
        }
    };
    /**ACCESSIBILITY **/
    //Keyboard events
    StarRatingComponent.prototype.onKeyDown = function (event) {
        var _this = this;
        var handlers = {
            //Decrement
            Minus: function () { return _this.decrement(); },
            ArrowDown: function () { return _this.decrement(); },
            ArrowLeft: function () { return _this.decrement(); },
            //Increment
            Plus: function () { return _this.increment(); },
            ArrowRight: function () { return _this.increment(); },
            ArrowUp: function () { return _this.increment(); },
            //Reset
            Backspace: function () { return _this.reset(); },
            Delete: function () { return _this.reset(); },
            Digit0: function () { return _this.reset(); }
        };
        var handleDigits = function (eventCode) {
            var dStr = "Digit";
            var digit = parseInt(eventCode.substr(dStr.length, eventCode.length - 1));
            _this.rating = digit;
        };
        if (handlers[event['code']] || star_rating_utils_1.StarRatingUtils.isDigitKeyEventCode(event['code'])) {
            if (star_rating_utils_1.StarRatingUtils.isDigitKeyEventCode(event['code'])) {
                handleDigits(event['code']);
            }
            else {
                handlers[event['code']]();
            }
            event.preventDefault();
            event.stopPropagation();
        }
        this.saveOnTouch();
    };
    //Focus events
    StarRatingComponent.prototype.onBlur = function (event) {
        this.focus = false;
        event.preventDefault();
        event.stopPropagation();
        this.saveOnTouch();
    };
    StarRatingComponent.prototype.onFocus = function (event) {
        this.focus = true;
        event.preventDefault();
        event.stopPropagation();
        this.saveOnTouch();
    };
    //Hover events
    StarRatingComponent.prototype.onStarHover = function (rating) {
        if (!this.interactionPossible() || !this.hoverEnabled) {
            return;
        }
        this.hoverRating = rating ? parseInt(rating.toString()) : 0;
        //fire onHoverRatingChange event
        var $event = { hoverRating: this.hoverRating };
        this.saveOnHover($event);
    };
    /**Form Control - ControlValueAccessor implementation**/
    StarRatingComponent.prototype.writeValue = function (obj) {
        this.rating = obj;
    };
    StarRatingComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
        this.onModelChangeRegistered = true;
    };
    StarRatingComponent.prototype.registerOnTouched = function (fn) {
        this.onTouch = fn;
        this.onTouchRegistered = true;
    };
    //Overrides
    StarRatingComponent.prototype.setRating = function (value) {
        var initValue = this.rating;
        _super.prototype.setRating.call(this, value);
        //if value changed trigger valueAccessor events and outputs
        if (initValue !== this.rating) {
            var $event = { rating: this.rating };
            this.saveOnRatingChange($event);
            this.saveOnModelChange(this.rating);
        }
    };
    ;
    /**
     * onStarClicked
     *
     * Is fired when a star is clicked. And updated the rating value.
     * This function returns if the disabled or readOnly
     * property is set. If provided it emits the onClick event
     * handler with the actual rating value.
     *
     * @param rating
     */
    StarRatingComponent.prototype.onStarClicked = function (rating) {
        //fire onClick event
        if (!this.interactionPossible()) {
            return;
        }
        this.rating = rating;
        var onClickEventObject = {
            rating: this.rating
        };
        this.saveOnClick(onClickEventObject);
    };
    /**
     * ngOnChanges
     * @param changes
     */
    StarRatingComponent.prototype.ngOnChanges = function (changes) {
    };
    return StarRatingComponent;
}(star_rating_1.StarRating));
StarRatingComponent = __decorate([
    core_1.Component({
        selector: 'star-rating-comp',
        providers: [STAR_RATING_CONTROL_ACCESSOR],
        inputs: [
            'getHalfStarVisible',
            'getColor',
            'showHalfStars',
            'hoverEnabled',
            'rating',
            'step',
            'disabled',
            'readOnly',
            'space',
            'starType',
            'size',
            'speed',
            'numOfStars',
            'direction',
            'staticColor',
            'labelPosition',
            'labelText',
            'id'
        ],
        outputs: [
            'onClick',
            'onRatingChange',
            'onHoverRatingChange'
        ],
        templateUrl: './star-rating.component.html'
    }),
    __metadata("design:paramtypes", [])
], StarRatingComponent);
exports.StarRatingComponent = StarRatingComponent;
//# sourceMappingURL=star-rating.component.js.map