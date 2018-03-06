import { ServiceUtils } from './../../../service/serviceUtils';
import { Utils } from './../../../shared/utils';
import { Person } from './../../../model/person';
import { Url } from './../../../constant/url';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PersonSearchService {

  constructor(private serviceUtils: ServiceUtils, private http: HttpClient) { }

  search(term: string, adult: boolean): Observable<Person[]> {
    let url = Url.PERSON_SEARCH_URL + Url.API_KEY;
    if (adult) {
      url += Url.ADULT_URL;
    }
    url += `${Url.QUERY_URL}${term}`;
    return this.http
      .get(url, { headers: this.serviceUtils.getHeaders() })
      .map(this.mapPersons)
      .map(data => data.slice(0, 10));
  }

  mapPersons(response: any): Person[] {
    console.log(response.results);
    return response.results.map((r: any) => <Person>({
      id: r.id,
      name: r.name,
      adult: r.adult,
      thumbnail: Utils.getProfilPath(r, 92)
    }));
  }

}
