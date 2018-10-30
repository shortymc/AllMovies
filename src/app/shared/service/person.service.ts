import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
}
