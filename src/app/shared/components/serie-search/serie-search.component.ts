import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Serie } from '../../../model/serie';
import { SerieSearchService } from '../../service/serie-search.service';

@Component({
  selector: 'app-serie-search',
  templateUrl: './serie-search.component.html',
  styleUrls: ['./serie-search.component.scss'],
  providers: [SerieSearchService]
})
export class SerieSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchBox')
  inputSearch: HTMLFormElement;
  series: Observable<Serie[]>;
  private searchTerms = new Subject<string>();
  showSerie = false;
  language: string;
  subs = [];
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
    this.showSerie = result;
    if (this.showSerie) {
      this.search(this.inputSearch.nativeElement.value);
    }
  }

  constructor(
    private elemRef: ElementRef,
    private serieSearchService: SerieSearchService,
    private translate: TranslateService,
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    this.subs.push(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.search(this.inputSearch.nativeElement.value);
    }));
    this.series = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.serieSearchService.search(term, this.language)
          // or the observable of empty series if there was no search term
          : of<Serie[]>([])),
        catchError(error => {
          // TODO: add real error handling
          console.log(error);
          return of<Serie[]>([]);
        }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
