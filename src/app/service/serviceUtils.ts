import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';

@Injectable()
export class ServiceUtils {

  constructor(private http: HttpClient) {
  }

  static getErrorMessage(error: any): string {
    let message;
    if (error.response) {
      message = error.response.error;
    } else if (error.error && error.error.errors) {
      message = 'Status ' + error.status + ': ' + error.error.errors.join(', ');
    } else if (error.error) {
      message = error.error;
    } else if (error.message) {
      message = error.message;
    } else {
      message = error;
    }
    return message;
  }

  static encodeQueryUrl(query: string): string {
    return encodeURIComponent(query).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  getHeaders() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // headers.append('Accept', 'application/json');
    return headers;
  }

  handleSuccess(messageKey: string) {

  }

  handleError(error: any, toast: ToastService) {
    console.log('handleError');
    console.error('error', error);
    toast.open(ServiceUtils.getErrorMessage(error));
  }

  handlePromiseError(error: any, toast: ToastService): Promise<any> {
    console.log('handlePromiseError');
    console.error('error', error);
    toast.open(ServiceUtils.getErrorMessage(error));
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
