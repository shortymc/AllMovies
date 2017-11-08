import { Injectable } from '@angular/core';
import { Http, Response, Headers }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Person }   from './person';

@Injectable()
export class PersonSearchService {

	private api_key = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
	private personUrl = 'https://api.themoviedb.org/3/search/person?';
	private langue = '&language=fr';
    private adultUrl = '&include_adult=true';

	constructor(private http: Http) { }

	search(term: string, adult: boolean): Observable<Person[]> {
        let url = this.personUrl+this.api_key;
        if(adult) {url+=this.adultUrl;}
        url+=`&query=${term}`;
		return this.http
		.get(url, { headers: this.getHeaders() })
		.map(this.mapPersons)
		.map(data => data.slice(0,10));
	}

	getHeaders() {
		let headers = new Headers();
		headers.append('Accept', 'application/json');
		return headers;
	}

	mapPersons(response: Response): Person[] {
			// The response of the API has a results
			// property with the actual results
			return response.json().results.map((r: any) =>  <Person>({
				id: r.id,
				name: r.name,
				adult: r.adult
			}));
	}

}