import { Injectable } from '@angular/core';
import { Lang } from './../../model/model';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  constructor() { }

  getAll(): Promise<Lang[]> {
    return fetch(`assets/langs.json`, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then(res => {
      if (res.status >= 400) {
        console.error(res);
        throw new Error(`Bad response from server`);
      }
      return res.json();
    }).catch(err => {
      console.log(err);
    });
  }

}
