import { Observable } from 'rxjs/Observable';
import { MapMovie } from './../shared/mapMovie';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';
import { OmdbService } from './omdb.service';

@Injectable()
export class MovieService {

  constructor(private serviceUtils: ServiceUtils, private omdb: OmdbService) { }

  getPopularMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.getPromise(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .then(response => MapMovie.mapForPopularMovies(response))
      .catch(this.serviceUtils.handlePromiseError);
  }

  getMovies(ids: number[], language: string): Promise<Movie[]> {
    const obs = ids.map(id => this.getMovie(id, true, true, true, true, language));
    return Observable.forkJoin(obs).toPromise();
  }

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean, language: string): Observable<Movie> {
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
      url += `${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    }
    return this.serviceUtils.getObservable(url)
      .map(response => {
        const movie = MapMovie.mapForMovie(response);
        movie.lang_version = language;
        this.omdb.getMovie(movie.imdb_id).then(score => movie.score = score);
        return movie;
      }).catch(this.serviceUtils.handlePromiseError);
  }

  getMoviesByReleaseDates(debut: string, fin: string, language: string): Promise<Movie[]> {
    const url =
      `${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}${Url.LANGUE}${language}`;
    return this.serviceUtils.getPromise(url)
      .then(response => MapMovie.mapForMoviesByReleaseDates(response))
      .catch(this.serviceUtils.handlePromiseError);
  }
}
