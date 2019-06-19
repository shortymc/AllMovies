import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { Url } from './../../constant/url';
import { PaginateList, List } from './../../model/model';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable()
export class ListService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  private static mapLists(resp: any[]): List[] {
    return resp.map(r => {
      const list = new List();
      const keys = Object.keys(r);
      keys.forEach(key => {
        r[key] === null ? list[key] = undefined : list[key] = r[key];
      });
      return list;
    }).filter((list: List) =>
      list.poster_path && list.description.trim() !== ''
    );
  }

  getDataLists(dataId: number, language: string): Promise<List[]> {
    const url = `${Url.MOVIE_URl}/${dataId}/${Url.GET_MOVIE_LISTS}?${Url.API_KEY}${Url.LANGUE}${language}`;
    console.log('url', url);
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map((resp: any) => new PaginateList(resp.page, ListService.mapLists(resp.results), resp.total_pages, resp.total_results)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)))
      .toPromise()
      .then((lists: PaginateList) => {
        if (lists.total_pages > 1) {
          if (lists.total_pages >= 20) {
            console.log('Too many pages');
            lists.total_pages = 20;
          }
          const obs = [];
          for (let page = 2; page < lists.total_pages; page++) {
            obs.push(this.serviceUtils.getPromise(url + '&page=' + page, this.serviceUtils.getHeaders()));
          }
          try {
            return forkJoin(obs).toPromise().then((data: any[]) => {
              return lists.results.concat(...data.map(d => ListService.mapLists(d.results)));
            });
          } catch (err) {
            console.error(err);
          }
        } else {
          return lists.results;
        }
      });
  }
}
