import { MapPerson } from './../shared/mapPerson';
import { ServiceUtils } from './serviceUtils';
import { Url } from './../constant/url';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Person } from '../model/person';

@Injectable()
export class PersonService {

  constructor(private serviceUtils: ServiceUtils) { }

  getPerson(id: number, language: string): Promise<Person> {
    const url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}${Url.LANGUE}${language}${Url.APPEND}${Url.APPEND_IMAGES}${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    const urlMovies = `${Url.PERSON_URL}/${id}/${Url.MOVIE_CREDITS_URL}?${Url.API_KEY}${Url.LANGUE}${language}`;
    return Observable.forkJoin(
      this.serviceUtils.getObservable(url),
      this.serviceUtils.getObservable(urlMovies)
    ).map(responses => {
      return [].concat(...responses);
    }).map(response => MapPerson.mapForPerson(response))
      .toPromise()
      .catch(this.serviceUtils.handlePromiseError);
  }
}
