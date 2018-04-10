import { MapMovie } from './../shared/mapMovie';
import { Url } from './../constant/url';
import { Movie } from './../model/movie';
import { ToastService } from './toast.service';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MovieSearchService {

  constructor(private serviceUtils: ServiceUtils, private toast: ToastService) { }

  search(term: string, adult: boolean, language: string): Observable<Movie[]> {
    let url = Url.MOVIE_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    term = ServiceUtils.encodeQueryUrl(term);
    url += `${Url.QUERY_URL}${term}${Url.LANGUE}${language}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map(response => MapMovie.mapForSearchMovies(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
