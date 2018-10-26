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
    const url = UrlBuilder.personUrlBuilder(id, language, true);
    const urlMovies = `${Url.PERSON_URL}/${id}/${Url.MOVIE_CREDITS_URL}?${Url.API_KEY}${Url.LANGUE}${language}`;
    return Observable.forkJoin(
      this.serviceUtils.getObservable(url),
      this.serviceUtils.getObservable(urlMovies)
    ).map(responses => {
      return [].concat(...responses);
    }).map(response => MapPerson.mapForPerson(response))
      .toPromise()
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
