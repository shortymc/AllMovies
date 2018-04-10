import { Url } from './../constant/url';
import { Keyword } from './../model/model';
import { ServiceUtils } from './serviceUtils';
import { ToastService } from './toast.service';
import { SearchServiceService } from './searchService.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class KeywordSearchService implements SearchServiceService {

  constructor(private serviceUtils: ServiceUtils, private toast: ToastService) { }

  search(term: string): Observable<Keyword[]> {
    let url = Url.KEYWORD_SEARCH_URL + Url.API_KEY;
    term = ServiceUtils.encodeQueryUrl(term);
    url += `${Url.QUERY_URL}${term}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map((response: any) => response.results.slice(0, 10).map((r: any) => <Keyword>({ id: r.id, name: r.name })))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
