import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class MovieSearchService {

  constructor(private http: Http) { }

  search(term: string, adult: boolean): Observable<Movie[]> {
    let url = Url.MOVIE_SEARCH_URL + Url.API_KEY;
    if (adult) { url += Url.ADULT_URL; }
    url += `${Url.QUERY_URL}${term}${Url.LANGUE_FR}`;
    return this.http
      .get(url, { headers: this.getHeaders() })
      .map(this.mapMovies)
      .map(data => data.slice(0, 10));
  }

  getHeaders() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

  mapMovies(response: Response): Movie[] {
    // The response of the API has a results
    // property with the actual results
    return response.json().results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      adult: r.adult,
      original_title: r.original_title === r.title ? '' : r.original_title
    }));
  }

}
