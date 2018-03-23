import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';

@Injectable()
export class ServiceUtils {

  constructor(private http: HttpClient, private toast: ToastService) {
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

  handleSuccess(messageKey: string) {

  }

  handleError(error: any) {
    console.log('handleError');
    console.error('error', error);
    this.toast.open(error);
  }

  handlePromiseError(error: any): Promise<any> {
    console.log('handlePromiseError');
    console.error('error', error);
    this.toast.open(error.response.error);
    return new Promise<any>((resolve, reject) => {
      resolve();
    });
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
