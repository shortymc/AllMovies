import { Utils } from './../shared/utils';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class MovieService {

  constructor(private serviceUtils: ServiceUtils) { }

  getPopularMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.http.get(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .toPromise()
      .then(response => Utils.mapForPopularMovies(response))
      .catch(this.serviceUtils.handleError);
  }

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean, language: string): Promise<Movie> {
    //        const url = `${Url.MOVIE_URl}/${id}?${Url.API_KEY}${this.langue}${Url.APPEND}${Url.APPEND_VIDEOS},
    // ${Url.APPEND_CREDITS},${Url.APPEND_RECOMMENDATIONS},${Url.APPEND_IMAGES}`;
    let url = `${Url.MOVIE_URl}/${id}?${Url.API_KEY}`;
    if (video || credit || reco || image) {
      url += `${Url.APPEND}`;
      const parametres = [];
      if (video) {
        parametres.push(`${Url.APPEND_VIDEOS}`);
      }
      if (credit) {
        parametres.push(`${Url.APPEND_CREDITS}`);
      }
      if (reco) {
        parametres.push(`${Url.APPEND_RECOMMENDATIONS}`);
      }
      if (image) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      url += parametres.join(',');
    }
    if (language) {
      url += `${Url.LANGUE}${language}`;
    }
    return this.serviceUtils.http.get(url)
      .toPromise()
      .then(response => Utils.mapForMovie(response))
      .catch(this.serviceUtils.handleError);
  }

  getMoviesByReleaseDates(debut: string, fin: string, language: string): Promise<Movie[]> {
    const url =
`${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}${Url.LANGUE}${language}`;
    return this.serviceUtils.http.get(url)
      .toPromise()
      .then(response => Utils.mapForMoviesByReleaseDates(response))
      .catch(this.serviceUtils.handleError);
  }
}
