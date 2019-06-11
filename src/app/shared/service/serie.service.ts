import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MapSerie } from '../mapSerie';
import { Utils } from './../utils';
import { Url } from '../../constant/url';
import { DiscoverCriteria } from './../../model/discover-criteria';
import { Discover } from './../../model/discover';
import { UrlBuilder } from './../urlBuilder';
import { MapSeason } from './../mapSeason';
import { Season } from './../../model/season';
import { DetailConfig } from './../../model/model';
import { Serie } from '../../model/serie';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { OmdbService } from './omdb.service';

@Injectable()
export class SerieService {

  constructor(
    private omdb: OmdbService,
    private serviceUtils: UtilsService,
    private toast: ToastService
  ) { }

  getPopularSeries(language: string, page: number = 1): Promise<Serie[]> {
    return this.serviceUtils.getPromise(`${Url.MOST_POPULAR_SERIE_URL}${Url.LANGUE}${language}&page=${page}`)
      .then(response => MapSerie.mapForPopularSeries(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getSerie(id: number, config: DetailConfig, detail: boolean): Promise<Serie> {
    return this.serviceUtils.getPromise(UrlBuilder.detailUrlBuilder(false, id, config.video, config.credit, config.reco, config.release,
      config.keywords, config.similar, config.img, config.titles, config.external, config.lang))
      .then(response => {
        const serie = MapSerie.mapForSerie(response);
        serie.lang_version = config.lang;
        if (detail && (!serie.overview || (!serie.videos && config.video) || !serie.original_title)) {
          return this.getSerie(id,
            new DetailConfig(false, false, false, false, config.video, false, false, false, false, 'en'), false).then(enSerie => {
              serie.overview = Utils.isBlank(serie.overview) ? enSerie.overview : serie.overview;
              serie.videos = serie.videos && serie.videos.length > 0 ? serie.videos : enSerie.videos;
              serie.original_title = Utils.isBlank(serie.original_title) ? enSerie.overview : serie.original_title;
              serie.score = enSerie.score;
              return serie;
            });
        } else {
          return this.getImdbScore(serie);
        }
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getImdbScore(serie: Serie): Promise<Serie> {
    if (serie.imdb_id) {
      return this.omdb.getScore(serie.imdb_id).then(score => {
        if (score) {
          score.ratings.splice(-1, 0, ...[{ Source: 'MovieDB', Value: serie.vote + '/10' }, { Source: 'Popularity', Value: serie.popularity }]);
          score.moviedb_votes = serie.vote_count;
          serie.score = score;
        }
        return serie;
      });
    } else {
      return new Promise<Serie>((resolve, reject) => {
        resolve(serie);
      });
    }
  }

  getSeason(id: number, seasonNumber: number, language: string, detail: boolean): Promise<Season> {
    return this.serviceUtils.getPromise(UrlBuilder.seasonUrlBuilder(id, seasonNumber, language, detail, detail, detail))
      .then(response => {
        const season = MapSeason.mapForSeasonDetail(response);
        if (detail && (!season.overview || !season.videos) && language !== 'en') {
          return this.getSeason(id, seasonNumber, 'en', true).then(enSeason => {
            season.overview = Utils.isBlank(season.overview) ? enSeason.overview : season.overview;
            season.videos = season.videos && season.videos.length > 0 ? season.videos : enSeason.videos;
            return season;
          });
        } else {
          return season;
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

  getSeriesDiscover(criteria: DiscoverCriteria, genre: number[], keyword: number[],
    networks: number[], isWithoutGenre: boolean, isWithoutKeyword: boolean): Promise<Discover> {
    return this.serviceUtils.getPromise(
      UrlBuilder.discoverUrlBuilder(false, criteria, undefined, genre, keyword, networks, isWithoutGenre, isWithoutKeyword))
      .then((response: any) => {
        const discover = MapSerie.mapForDiscover(response);
        // discover.movies.forEach((movie) => this.omdb.getMovie(movie.imdb_id).then(score => movie.score = score));
        return discover;
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }
}
