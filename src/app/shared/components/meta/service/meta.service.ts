import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { DuckDuckGo } from './../../../../constant/duck-duck-go';
import { Constants } from './../../../../constant/constants';
import { UtilsService } from './../../../service/utils.service';
import { ToastService } from '../../../service/toast.service';

@Injectable()
export class MetaService {
  private score: string;

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getLinkScore(title: string, site: any, imdbId: string, isMovie: boolean): Promise<string> {
    if (site === DuckDuckGo.SEARCH_BANG_WIKI_EN.site || site === DuckDuckGo.SEARCH_BANG_WIKI_FR.site) {
      return this.wikisearch(title, site).toPromise();
    } else if (site === DuckDuckGo.SEARCH_BANG_IMDB.site && imdbId) {
      return new Promise(resolve => resolve(Constants.IMDB_URL + (isMovie ? Constants.IMDB_MOVIE_SUFFIX : Constants.IMDB_PERSON_SUFFIX) + imdbId));
    } else {
      let url = DuckDuckGo.DUCKDUCKGO_URL + site + '+';
      url += UtilsService.encodeQueryUrl(title) + '&format=json&no_redirect=1';
      return this.serviceUtils.jsonpPromise(url, 'callback')
        .then((data: any) => {
          let result = <string>data.Redirect;
          if (site === DuckDuckGo.SEARCH_BANG_METACRITIC.site) {
            result = isMovie ? result.replace('/all/', '/movie/') : result.replace('/all/', '/person/');
          } else if (site === DuckDuckGo.SEARCH_BANG_SENSCRITIQUE.site) {
            result += isMovie ? '&filter=movies' : '&filter=contacts';
          }
          return result;
        })
        .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
    }
  }

  wikisearch(term: string, site: string): Observable<any> {
    const params = new HttpParams()
      .set('action', 'opensearch')
      .set('search', term)
      .set('format', 'json');

    const url = site === DuckDuckGo.SEARCH_BANG_WIKI_EN.site ? `http://en.wikipedia.org/w/api.php?${params.toString()}`
      : `http://fr.wikipedia.org/w/api.php?${params.toString()}`;

    return this.serviceUtils.jsonpObservable(url, 'callback')
      .pipe(
        map(response => response[3][0]),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)));
  }

  public getScore(): string {
    return this.score;
  }
}
