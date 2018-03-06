import { Utils } from './../shared/utils';
import { ServiceUtils } from './serviceUtils';
import { Url } from './../constant/url';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Person } from '../model/person';

@Injectable()
export class PersonService {

  constructor(private serviceUtils: ServiceUtils) { }

  getPerson(id: number, language: string): Promise<Person> {
    //        const url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}${Url.LANGUE_FR},${Url.APPEND_IMAGES}`;
    const url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}${Url.LANGUE}${language}${Url.APPEND}${Url.APPEND_IMAGES}`;
    const urlMovies = `${Url.PERSON_URL}/${id}/${Url.MOVIE_CREDITS_URL}?${Url.API_KEY}${Url.LANGUE}${language}`;
    return Observable.forkJoin(
      this.serviceUtils.http.get(url),
      this.serviceUtils.http.get(urlMovies)
    ).map(responses => {
      return [].concat(...responses);
    }).map(response => Utils.mapForPerson(response))
      .toPromise()
      .catch(this.serviceUtils.handleError);
  }
}
