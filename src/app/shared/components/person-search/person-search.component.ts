import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Person } from '../../../model/person';
import { PersonSearchService } from '../../service/person-search.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
})
export class PersonSearchComponent implements OnInit {
  @ViewChild('searchBox')
  inputSearch: HTMLFormElement;
  persons: Observable<Person[]>;
  private searchTerms = new Subject<string>();
  showPerson = false;
  pseudo: string;
  faSearch = faSearch;
  @HostListener('document:click', ['$event']) onMousClicked(event: any): void {
    let result = false;
    let clickedComponent = event.target;
    do {
      if (clickedComponent === this.elemRef.nativeElement) {
        result = true;
        break;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    this.showPerson = result;
    if (this.showPerson) {
      this.search(this.inputSearch.nativeElement.value);
    }
  }

  constructor(
    private elemRef: ElementRef,
    private personSearchService: PersonSearchService,
    private router: Router
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pseudo = AuthService.decodeToken().name;
    this.persons = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.personSearchService.search(term, this.pseudo === 'Test')
          // or the observable of empty persons if there was no search term
          : of<Person[]>([])),
        catchError(error => {
          // TODO: add real error handling
          console.error(error);
          return of<Person[]>([]);
        }));
  }

  gotoPerson(person: Person): void {
    this.showPerson = false;
    this.router.navigate(['/person', person.id]);
  }
}
