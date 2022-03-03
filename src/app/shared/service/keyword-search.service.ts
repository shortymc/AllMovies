import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {Url} from './../../constant/url';
import {Keyword} from './../../model/model';
import {UtilsService} from './utils.service';
import {ToastService} from './toast.service';
import {SearchService} from './search.service';

@Injectable({
  providedIn: 'root',
})
export class KeywordSearchService implements SearchService<Keyword> {
  constructor(
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) {}

  search(term: string): Observable<Keyword[]> {
    let url = Url.KEYWORD_SEARCH_URL + Url.API_KEY;
    url += `${Url.QUERY_URL}${UtilsService.encodeQueryUrl(term)}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map((response: any) =>
          response.results
            .slice(0, 10)
            .map((r: any) => <Keyword>{id: r.id, name: r.name})
        ),
        catchError(err => this.serviceUtils.handlePromiseError(err, this.toast))
      );
  }

  byId(id: number): Observable<Keyword> {
    return this.serviceUtils
      .getObservable(
        `${Url.KEYWORD_URL}${id}?${Url.API_KEY}`,
        this.serviceUtils.getHeaders()
      )
      .pipe(
        map((response: any) => <Keyword>{id: response.id, name: response.name}),
        catchError(err => this.serviceUtils.handlePromiseError(err, this.toast))
      );
  }
}
