import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockService<T> {
  constructor() {}

  getAll(file: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './assets/' + file);
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
