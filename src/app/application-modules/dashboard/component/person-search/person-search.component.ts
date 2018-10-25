import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Person } from '../../../../model/person';
import { AuthService } from '../../../../shared/shared.module';
import { PersonSearchService } from '../../../../shared/shared.module';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
  providers: [PersonSearchService]
})
export class PersonSearchComponent implements OnInit {
  persons: Observable<Person[]>;
  private searchTerms = new Subject<string>();
  adult = false;
  showPerson = false;
  pseudo: string;

  constructor(
    private personSearchService: PersonSearchService,
    private router: Router) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pseudo = AuthService.decodeToken().name;
    this.persons = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      // .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.personSearchService.search(term, this.adult)
        // or the observable of empty persons if there was no search term
        : Observable.of<Person[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.error(error);
        return Observable.of<Person[]>([]);
      });
  }

  gotoPerson(person: Person): void {
    this.router.navigate(['/person', person.id]);
  }
}
