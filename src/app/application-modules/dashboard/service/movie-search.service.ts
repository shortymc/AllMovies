import { MapMovie } from './../../../shared/mapMovie';
import { ServiceUtils } from './../../../service/serviceUtils';
import { Movie } from './../../../model/movie';
import { Url } from './../../../constant/url';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MovieSearchService {

  constructor(private serviceUtils: ServiceUtils) { }

  search(term: string, adult: boolean, language: string): Observable<Movie[]> {
    let url = Url.MOVIE_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    url += `${Url.QUERY_URL}${term}${Url.LANGUE}${language}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map(response => MapMovie.mapForSearchMovies(response))
      .catch(this.serviceUtils.handleError);
  }
}
