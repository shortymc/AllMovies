import { forkJoin, Observable, of, merge } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError, flatMap, delay } from 'rxjs/operators';

import { Url } from './../../constant/url';
import { Paginate, List, FullList } from './../../model/model';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { MapList } from '../mapList';

@Injectable()
export class ListService {

  static readonly PAGES_BY = 19;

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
          const max = Math.floor(lists.total_pages / ListService.PAGES_BY);
          let obs: Observable<number> = of(0);
          for (let index = 1; index <= max; index++) {
            obs = merge(obs, of(index).pipe(delay(10000 * index)));
          }

          const result: List[] = [];
          return obs.pipe(
            flatMap((x: number) => this.getPages(x, lists.total_pages, url)),
            map(data => {
              result.push(...data);
              return result;
            }),
            catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast))
          ).toPromise();
        }
      });
  }

  getPages(index: number, total_pages: number, url: string): Observable<List[]> {
    const result: List[] = [];
    const obs = [];
    for (let page = 1 + index * ListService.PAGES_BY; page <= (index + 1) * ListService.PAGES_BY; page++) {
      if (page < total_pages) {
        obs.push(this.serviceUtils.getPromise(`${url}${Url.PAGE_URL}${page}`, this.serviceUtils.getHeaders()));
      }
    }
    try {
      return forkJoin(obs).pipe(map((data: any[]) => {
        return result.concat(...data.map(d => MapList.mapLists(d.results)));
      }));
    } catch (err) {
      console.error(err);
    }
  }

  getListDetail(id: number, language: string, sort: string, page: number = 1): Promise<FullList> {
    return this.serviceUtils.getPromise(
      `${Url.GET_LISTS_DETAILS}${id}?${Url.API_KEY}${Url.LANGUE}${language}${Url.PAGE_URL}${page}${Url.SORT_BY_URL}${sort}`)
      .then((response: any) => MapList.mapFullList(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
