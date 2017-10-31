import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Movie }           from './movie';

@Injectable()
export class MovieSearchService {

    constructor(private http: Http) { }

    search(term: string): Observable<Movie[]> {
        return this.http
            .get(`api/movies/?title=${term}`)
            .map(response => response.json().data as Movie[]);
    }
}