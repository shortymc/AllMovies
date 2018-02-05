import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { PersonService } from '../../service/person.service';
import { Person } from '../../model/person';
import { Url } from '../../constant/url';

@Component({
    selector: 'person-detail',
    styleUrls: ['./person-detail.component.css'],
    templateUrl: './person-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
    person: Person;
    isImagesCollapsed = false;
    Url = Url;

    constructor(
        private personService: PersonService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }
    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.personService.getPerson(+params.get('id')))
            .subscribe(person => this.person = person);
    }
    goBack(): void {
        let back = this.location.back();
        if (back === undefined) {
            this.router.navigate(['/']);
        }
    }
}
