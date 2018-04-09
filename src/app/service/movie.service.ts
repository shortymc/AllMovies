import { DiscoverCriteria } from './../model/discover-criteria';
import { Discover } from './../model/discover';
import { Observable } from 'rxjs/Observable';
import { MapMovie } from './../shared/mapMovie';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';
import { OmdbService } from './omdb.service';
import { ToastService } from './toast.service';
import { UrlBuilder } from '../shared/urlBuilder';

@Injectable()
export class MovieService {

  constructor(private serviceUtils: ServiceUtils, private omdb: OmdbService, private toast: ToastService) { }

  getPopularMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.getPromise(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .then(response => MapMovie.mapForPopularMovies(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMovies(ids: number[], language: string): Promise<Movie[]> {
    const obs = ids.map(id => this.getMovie(id, true, true, true, true, language));
    return Observable.forkJoin(obs).toPromise();
  }

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean, language: string): Observable<Movie> {
    return this.serviceUtils.getObservable(UrlBuilder.movieUrlBuilder(id, video, credit, reco, image, language))
      .map(response => {
        const movie = MapMovie.mapForMovie(response);
        movie.lang_version = language;
        this.omdb.getMovie(movie.imdb_id).then(score => movie.score = score);
        return movie;
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMoviesByReleaseDates(debut: string, fin: string, language: string): Promise<Movie[]> {
    const url =
      `${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}${Url.LANGUE}${language}`;
    return this.serviceUtils.getPromise(url)
      .then(response => MapMovie.mapForMoviesByReleaseDates(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMoviesDiscover(criteria: DiscoverCriteria): Promise<Discover> {
    return this.serviceUtils.getPromise(
      UrlBuilder.discoverUrlBuilder(criteria))
      .then((response: any) => {
        const discover = MapMovie.mapForDiscover(response);
        // discover.movies.forEach((movie) => this.omdb.getMovie(movie.imdb_id).then(score => movie.score = score));
        return discover;
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

}
