import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class ServiceUtils {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {
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

}
