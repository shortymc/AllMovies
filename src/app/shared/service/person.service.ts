import { Injectable } from '@angular/core';

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

  getPerson(id: number, language: string): Promise<Person> {
    return this.serviceUtils.getObservable(UrlBuilder.personUrlBuilder(id, language, true, true))
      .map(response => MapPerson.mapForPerson(response))
      .toPromise()
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getPopularPersons(language: string): Promise<Person[]> {
    return this.serviceUtils.getPromise(`${Url.GET_POPULAR_PERSON}${Url.LANGUE}${language}`)
      .then((response: any) => response.results.map(res => MapPerson.mapForPerson(res)))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
