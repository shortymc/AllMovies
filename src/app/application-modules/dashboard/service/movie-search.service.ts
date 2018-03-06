import { ServiceUtils } from './../../../service/serviceUtils';
import { Utils } from './../../../shared/utils';
import { Movie } from './../../../model/movie';
import { Url } from './../../../constant/url';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MovieSearchService {

  constructor(private serviceUtils: ServiceUtils, private http: HttpClient) { }

  search(term: string, adult: boolean, language: string): Observable<Movie[]> {
    let url = Url.MOVIE_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    url += `${Url.QUERY_URL}${term}${Url.LANGUE}${language}`;
    return this.http
      .get(url, { headers: this.serviceUtils.getHeaders() })
      .map(this.mapMovies)
      .map(data => data.slice(0, 5));
  }

  mapMovies(response: any): Movie[] {
    // console.log(response.results);
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      adult: r.adult,
      original_title: Utils.getTitle(r),
      thumbnail: Utils.getPosterPath(r, 0)
    }));
  }

}
