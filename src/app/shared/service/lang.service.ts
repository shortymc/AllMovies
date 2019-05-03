import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

import { SearchService } from './search.service';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { LangDb } from '../../model/model';
import { Url } from '../../constant/url';
import { Utils } from '../utils';

@Injectable()
export class LangService implements SearchService<LangDb> {
  langs: LangDb[];

  constructor(
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) { }

  getAll(): Promise<LangDb[]> {
    const url = `${Url.GET_ALL_LANGS_URL}${Url.API_KEY}`;
    return this.serviceUtils
      .getPromise(url, this.serviceUtils.getHeaders())
      .then((response: any) => {
        this.langs = this.mapLang(response);
        return this.langs;
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  mapLang(response: any): LangDb[] {
    const result = response.map(element => {
      const lang = new LangDb();
      lang.id = element.iso_639_1;
      lang.name = element.english_name;
      return lang;
    });
    return result.sort((a, b) => Utils.compare(a.name, b.name, true));
  }

  search(term: string): Observable<LangDb[]> {
    return from(this.getAll().then(langs => langs.filter(l => l.name.toLowerCase().startsWith(term.toLowerCase())).slice(0, 10)));
  }

  byId(id: string): Observable<LangDb> {
    return from(this.getAll().then(langs => langs.find(l => l.id === id)));
  }
}
