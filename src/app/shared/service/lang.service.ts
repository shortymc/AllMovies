import { Injectable } from '@angular/core';

@Injectable()
export class LangService {

  constructor() { }

  getAll(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './assets/langs.json');
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.responseText));
          }
        }
      };
    });
  }

}
