import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MapPerson } from './../../shared/mapPerson';
import { Person } from './../../model/person';
import { Url } from './../../constant/url';
import { UtilsService } from './utils.service';
import { ToastService } from './toast.service';
import { SearchServiceService } from './searchService.service';

@Injectable()
export class PersonSearchService implements SearchServiceService<Person> {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  search(term: string, adult: boolean): Observable<Person[]> {
    let url = Url.PERSON_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    url += `${Url.QUERY_URL}${UtilsService.encodeQueryUrl(term)}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map(response => MapPerson.mapForSearchPersons(response)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)));
  }
}
