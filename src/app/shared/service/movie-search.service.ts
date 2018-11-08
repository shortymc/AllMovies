import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapMovie } from './../../shared/mapMovie';
import { Url } from './../../constant/url';
import { Movie } from './../../model/movie';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable()
export class MovieSearchService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  search(term: string, adult: boolean, language: string): Observable<Movie[]> {
    let url = Url.MOVIE_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    url += `${Url.QUERY_URL}${UtilsService.encodeQueryUrl(term)}${Url.LANGUE}${language}`;
    console.log(url);
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map(response => MapMovie.mapForSearchMovies(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
