import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { Url } from './../../constant/url';
import { Genre } from './../../model/model';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable()
export class GenreService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getAllGenre(language: string): Observable<Genre[]> {
    const url = `${Url.GET_ALL_GENRES_URL}${Url.API_KEY}${Url.LANGUE}${language}`;
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .map((response: any) => response.genres.map((r: any) => <Genre>({ id: r.id, name: r.name })))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

}
