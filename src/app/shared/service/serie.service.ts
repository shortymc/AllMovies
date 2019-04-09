import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MapSerie } from '../mapSerie';
import { Url } from '../../constant/url';
import { Serie } from '../../model/serie';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable()
export class SerieService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  search(term: string, language: string): Observable<Serie[]> {
    const url = `${Url.SERIE_SEARCH_URL}${Url.API_KEY}${Url.QUERY_URL}${UtilsService.encodeQueryUrl(term)}${Url.LANGUE}${language}`;
    console.log(url);
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map(response => MapSerie.mapForSearchSeries(response)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast))
      );
  }
}
