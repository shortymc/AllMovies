import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { PersonService } from './person.service';
import 'rxjs/add/operator/switchMap';
import { Person } from './person';

@Component({
    selector: 'person-detail',
    styleUrls: ['./person-detail.component.css'],
    templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
    person: Person;
    private original = "https://image.tmdb.org/t/p/original";
    private thumb = "https://image.tmdb.org/t/p/w154";
    private preview = "https://image.tmdb.org/t/p/w92";

    constructor(
        private personService: PersonService,
        private route: ActivatedRoute,
        private location: Location
    ) { }
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.personService.getPerson(+params.get('id')))
            .subscribe(person => this.person = person);
    }
    goBack(): void {
        if(this.location._baseHref !== "") {
            this.location.back();
        } else {
            this.router.navigate(['/']);    
        }
    }
}