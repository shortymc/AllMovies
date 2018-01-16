"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const common_1 = require("@angular/common");
require("rxjs/add/operator/switchMap");
const person_service_1 = require("../../person.service");
let PersonDetailComponent = class PersonDetailComponent {
    constructor(personService, route, location, router) {
        this.personService = personService;
        this.route = route;
        this.location = location;
        this.router = router;
        this.isImagesCollapsed = false;
        this.original = 'https://image.tmdb.org/t/p/original';
        this.thumb = 'https://image.tmdb.org/t/p/w154';
        this.preview = 'https://image.tmdb.org/t/p/w92';
    }
    ngOnInit() {
        this.route.paramMap
            .switchMap((params) => this.personService.getPerson(+params.get('id')))
            .subscribe(person => this.person = person);
    }
    goBack() {
        let back = this.location.back();
        if (back === undefined) {
            this.router.navigate(['/']);
        }
    }
};
PersonDetailComponent = __decorate([
    core_1.Component({
        selector: 'person-detail',
        styleUrls: ['./person-detail.component.css'],
        templateUrl: './person-detail.component.html',
    }),
    __metadata("design:paramtypes", [person_service_1.PersonService,
        router_1.ActivatedRoute,
        common_1.Location,
        router_1.Router])
], PersonDetailComponent);
exports.PersonDetailComponent = PersonDetailComponent;
//# sourceMappingURL=person-detail.component.js.map