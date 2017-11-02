import { Injectable } from '@angular/core';
import { Http, Response, Headers }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Movie }   from './movie';

@Injectable()
export class MovieSearchService {

    private api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
    private movieUrl = 'https://api.themoviedb.org/3/search/movie?';

    constructor(private http: Http) { }

    search(term: string): Observable<Movie[]> {
        let movies = this.http
            .get(this.movieUrl+this.api_key+`&include_adult=true&query=${term}`, { headers: this.getHeaders() })
            .map(this.mapMovies);
        return movies;
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }
            
   mapMovies(response: Response): Movie[] {
        // The response of the API has a results
        // property with the actual results
        return response.json().results.map((r: any) =>  <Movie>({
        id: r.id,
        title: r.title,
        date: r.release_date,
        adult: r.adult
      }));
    }

}