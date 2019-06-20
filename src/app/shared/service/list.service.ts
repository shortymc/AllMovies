import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { Url } from './../../constant/url';
import { Paginate, List, FullList } from './../../model/model';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { MapList } from '../mapList';

@Injectable()
export class ListService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getDataLists(dataId: number, language: string): Promise<List[]> {
    const url = `${Url.MOVIE_URl}/${dataId}/${Url.GET_MOVIE_LISTS}?${Url.API_KEY}${Url.LANGUE}${language}`;
    console.log('url', url);
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map((resp: any) => new Paginate(resp.page, MapList.mapLists(resp.results), resp.total_pages, resp.total_results)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)))
      .toPromise()
      .then((lists: Paginate<List>) => {
        if (lists.total_pages > 1) {
          if (lists.total_pages >= 20) {
            console.log('Too many pages');
            lists.total_pages = 20;
          }
          const obs = [];
          for (let page = 2; page < lists.total_pages; page++) {
            obs.push(this.serviceUtils.getPromise(`${url}${Url.PAGE_URL}${page}`, this.serviceUtils.getHeaders()));
          }
          try {
            return forkJoin(obs).toPromise().then((data: any[]) => {
              return lists.results.concat(...data.map(d => MapList.mapLists(d.results)));
            });
          } catch (err) {
            console.error(err);
          }
        } else {
          return lists.results;
        }
      });
  }

  getListDetail(id: number, language: string, sort: string, page: number = 1): Promise<FullList> {
    return this.serviceUtils.getPromise(
      `${Url.GET_LISTS_DETAILS}${id}?${Url.API_KEY}${Url.LANGUE}${language}${Url.PAGE_URL}${page}${Url.SORT_BY_URL}${sort}`)
      .then((response: any) => MapList.mapFullList(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
