import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Person } from '../../../model/person';
import { ImageSize } from '../../../model/model';
import { PersonSearchService } from '../../service/person-search.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
})
export class PersonSearchComponent implements OnInit {
  persons: Observable<Person[]>;
  private searchTerms = new Subject<string>();
  showPerson = false;
  adult: boolean;
  imageSize = ImageSize;
  faSearch = faSearch;

  constructor(
    private personSearchService: PersonSearchService,
    private auth: AuthService
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.adult = user.adult;
      }
    });
    this.persons = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.personSearchService.search(term, this.adult)
          // or the observable of empty persons if there was no search term
          : of<Person[]>([])),
        catchError(error => {
          // TODO: add real error handling
          console.error(error);
          return of<Person[]>([]);
        }));
  }
}
