import { Injectable } from '@angular/core';

import { Utils } from './../utils';
import { MapPerson } from './../../shared/mapPerson';
import { UtilsService } from './utils.service';
import { Url } from './../../constant/url';
import { Person } from '../../model/person';
import { ToastService } from './toast.service';
import { UrlBuilder } from '../urlBuilder';

@Injectable()
export class PersonService {

  constructor(
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) { }

  getPerson(id: number, language: string, detail: boolean): Promise<Person> {
    return this.serviceUtils.getPromise(UrlBuilder.personUrlBuilder(id, language, true, true))
      .then(response => {
        const person = MapPerson.mapForPerson(response);
        if (detail && !person.biography) {
          return this.getPerson(id, 'en', false).then(enPerson => {
            person.biography = Utils.isBlank(person.biography) ? enPerson.biography : person.biography;
            return person;
          });
        } else {
          return person;
        }
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getPopularPersons(language: string, page: number = 1): Promise<Person[]> {
    return this.serviceUtils.getPromise(`${Url.GET_POPULAR_PERSON}${Url.LANGUE}${language}${Url.PAGE_URL}${page}`)
      .then((response: any) => response.results.map(res => MapPerson.mapForPerson(res)))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
