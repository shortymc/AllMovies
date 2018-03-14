import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class ServiceUtils {

  constructor(private http: HttpClient) {
  }

  getHeaders() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // headers.append('Accept', 'application/json');
    return headers;
  }

  encodeQueryUrl(query: string): string {
    return encodeURIComponent(query).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getPromise(url: string, headers?: HttpHeaders): Promise<Object> {
    return this.getObservable(url, headers).toPromise();
  }

  getObservable(url: string, headers?: HttpHeaders): Observable<Object> {
    return headers ? this.http.get(url, { headers: headers }) : this.http.get(url);
  }

  jsonpPromise(url: string, callback: any): Promise<Object> {
    return this.jsonpObservable(url, callback).toPromise();
  }

  jsonpObservable(url: string, callback: any): Observable<Object> {
    return this.http.jsonp(url, callback);
  }

}
