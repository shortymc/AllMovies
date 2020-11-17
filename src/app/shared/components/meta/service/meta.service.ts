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

  getLinkScore(title: string, original_title: string, userLang: string, itemLang: string, site: any, imdbId: string, isMovie: boolean,
    isSerie: boolean): Promise<string> {
    const workingTitle =
      (userLang === 'fr' && ['gb', 'en'].includes(itemLang) &&
        [DuckDuckGo.SEARCH_BANG_METACRITIC.site, DuckDuckGo.SEARCH_BANG_WIKI_EN.site].includes(site)) ||
        (userLang === 'en' && itemLang === 'fr' &&
          [DuckDuckGo.SEARCH_BANG_SENSCRITIQUE.site, DuckDuckGo.SEARCH_BANG_WIKI_FR.site].includes(site))
        ? original_title : title;

    if (site === DuckDuckGo.SEARCH_BANG_WIKI_EN.site || site === DuckDuckGo.SEARCH_BANG_WIKI_FR.site) {
      return this.wikisearch(workingTitle, site).toPromise();
    } else if (site === DuckDuckGo.SEARCH_BANG_IMDB.site && imdbId) {
      return new Promise(resolve =>
        resolve(Constants.IMDB_URL + ((isMovie || isSerie) ? Constants.IMDB_MOVIE_SUFFIX : Constants.IMDB_PERSON_SUFFIX) + imdbId));
    } else {
      let url = DuckDuckGo.DUCKDUCKGO_URL + site + '+';
      url += UtilsService.encodeQueryUrl(workingTitle) + '&format=json&no_redirect=1';
      return this.serviceUtils.getPromise(url)
        .then((data: any) => {
          let result = <string>data.Redirect;
          if (site === DuckDuckGo.SEARCH_BANG_METACRITIC.site) {
            if (isMovie) {
              result = result.replace('/all/', '/movie/');
            } else if (isSerie) {
              result = result.replace('/all/', '/tv/');
            } else {
              result = result.replace('/all/', '/person/');
            }
          } else if (site === DuckDuckGo.SEARCH_BANG_SENSCRITIQUE.site) {
            if (isMovie) {
              result += '&filter=movies';
            } else if (isSerie) {
              result += '&filter=tvshows';
            } else {
              result += '&filter=contacts';
            }
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

    const url = `https://${site === DuckDuckGo.SEARCH_BANG_WIKI_EN.site ? 'en' : 'fr'}.wikipedia.org/w/api.php?${params.toString()}`;

    console.log('meta', url);
    return this.serviceUtils.jsonpObservable(url, 'callback')
      .pipe(
        map(response => response[3][0]),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)));
  }

  public getScore(): string {
    return this.score;
  }
}
