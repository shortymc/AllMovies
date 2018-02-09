import { Url } from './../constant/url';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Person } from '../model/person';

@Injectable()
export class PersonSearchService {

    constructor(private http: Http) { }

    search(term: string, adult: boolean): Observable<Person[]> {
        let url = Url.PERSON_SEARCH_URL + Url.API_KEY;
        if (adult) { url += Url.ADULT_URL; }
        url += `${Url.QUERY_URL}${term}`;
        return this.http
            .get(url, { headers: this.getHeaders() })
            .map(this.mapPersons)
            .map(data => data.slice(0, 10));
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }

    mapPersons(response: Response): Person[] {
        // The response of the API has a results
        // property with the actual results
        return response.json().results.map((r: any) => <Person>({
            id: r.id,
            name: r.name,
            adult: r.adult
        }));
    }

}
