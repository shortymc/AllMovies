import { TranslateService} from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import { Serie } from '../../../model/serie';
import { ImageSize } from '../../../model/model';
import { SerieService } from '../../service/serie.service';

@Component({
  selector: 'app-serie-search',
  templateUrl: './serie-search.component.html',
  styleUrls: ['./serie-search.component.scss'],
})
export class SerieSearchComponent implements OnInit, OnDestroy {
  series: Observable<Serie[]>;
  private searchTerms = new Subject<string>();
  showSerie = false;
  subs = [];
  imageSize = ImageSize;
  faSearch = faSearch;

  constructor(
    private serieService: SerieService,
    private translate: TranslateService,
  ) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.series = this.searchTerms
      .pipe(
        debounceTime(300),        // wait 300ms after each keystroke before considering the term
        // .distinctUntilChanged()   // ignore if next search term is same as previous
        switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.serieService.search(term, this.translate.currentLang)
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
