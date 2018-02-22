import { Person } from './../../../model/person';
import { Url } from './../../../constant/url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PersonSearchService {

  constructor(private http: HttpClient) { }

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
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    return headers;
  }

  mapPersons(response: any): Person[] {
    // The response of the API has a results
    // property with the actual results
    console.log(response.results);
    return response.results.map((r: any) => <Person>({
      id: r.id,
      name: r.name,
      adult: r.adult,
      thumbnail: r.profile_path === null ? null : Url.IMAGE_URL_92 + r.profile_path
    }));
  }

}
