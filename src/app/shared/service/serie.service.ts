import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MapSerie } from '../mapSerie';
import { Utils } from './../utils';
import { Url } from '../../constant/url';
import { UrlBuilder } from './../urlBuilder';
import { DetailConfig } from './../../model/model';
import { Serie } from '../../model/serie';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable()
export class SerieService {

  constructor(private serviceUtils: UtilsService, private toast: ToastService) { }

  getSerie(id: number, config: DetailConfig, detail: boolean): Promise<Serie> {
    return this.serviceUtils.getPromise(UrlBuilder.detailUrlBuilder(false, id, config.video, config.credit,
      config.reco, config.release, config.keywords, config.similar, config.img, config.titles, config.lang))
      .then(response => {
        const serie = MapSerie.mapForSerie(response);
        serie.lang_version = config.lang;
        if (detail && (!serie.overview || (!serie.videos && config.video) || !serie.original_title)) {
          return this.getSerie(id,
            new DetailConfig(false, false, false, false, config.video, false, false, false, 'en'), false).then(enSerie => {
              serie.overview = Utils.isBlank(serie.overview) ? enSerie.overview : serie.overview;
              serie.videos = serie.videos && serie.videos.length > 0 ? serie.videos : enSerie.videos;
              serie.original_title = Utils.isBlank(serie.original_title) ? enSerie.overview : serie.original_title;
              serie.score = enSerie.score;
              return serie;
            });
        } else {
          return serie;
        }
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  search(term: string, language: string): Observable<Serie[]> {
    const url = `${Url.SERIE_SEARCH_URL}${Url.API_KEY}${Url.QUERY_URL}${UtilsService.encodeQueryUrl(term)}${Url.LANGUE}${language}`;
    console.log(url);
    return this.serviceUtils
      .getObservable(url, this.serviceUtils.getHeaders())
      .pipe(
        map(response => MapSerie.mapForSearchSeries(response)),
        catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast))
      );
  }
}
