import { Observable, forkJoin } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { DiscoverCriteria } from './../../model/discover-criteria';
import { Discover } from './../../model/discover';
import { MapMovie } from './../../shared/mapMovie';
import { UtilsService } from './utils.service';
import { Movie } from '../../model/movie';
import { Url } from '../../constant/url';
import { OmdbService } from './omdb.service';
import { ToastService } from './toast.service';
import { UrlBuilder } from '../../shared/urlBuilder';
import { Utils } from '../utils';

@Injectable()
export class MovieService {

  constructor(
    private serviceUtils: UtilsService,
    private omdb: OmdbService,
    private toast: ToastService,
  ) { }

  getPopularMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.getPromise(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .then(response => MapMovie.mapForPopularMovies(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMovies(ids: number[], language: string): Promise<Movie[]> {
    const obs = ids.map(id => this.getMovie(id, true, true, true, true, true, true, false, language));
    return forkJoin(obs).toPromise();
  }

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, keywords: boolean,
    similar: boolean, image: boolean, detail: boolean, language: string): Observable<Movie> {
    return this.serviceUtils.getObservable(UrlBuilder.movieUrlBuilder(id, video, credit, reco, keywords, similar, image, language))
      .pipe(
        map(response => {
          const movie = MapMovie.mapForMovie(response);
          movie.lang_version = language;
          return movie;
        }), flatMap((movie: Movie) => {
          if (detail && (!movie.synopsis || (!movie.videos && video) || !movie.original_title)) {
            return this.getMovie(id, video, false, false, false, false, false, false, 'en').toPromise().then(enMovie => {
              movie.synopsis = Utils.isBlank(movie.synopsis) ? movie.synopsis : enMovie.synopsis;
              movie.videos = movie.videos && movie.videos.length > 0 ? movie.videos : enMovie.videos;
              movie.original_title = Utils.isBlank(movie.original_title) ? movie.original_title : enMovie.original_title;
              return movie;
            }).then((film: Movie) => {
              return this.getImdbScore(film);
            });
          } else {
            return this.getImdbScore(movie);
          }
        }), catchError((err) => this.serviceUtils.handlePromiseError(err, this.toast)));
  }

  getImdbScore(movie: Movie): Promise<Movie> {
    if (movie.imdb_id) {
      return this.omdb.getMovie(movie.imdb_id).then(score => {
        movie.score = score;
        return movie;
      });
    } else {
      return new Promise<Movie>((resolve, reject) => {
        resolve(movie);
      });
    }
  }

  getMoviesByReleaseDates(debut: string, fin: string, language: string): Promise<Movie[]> {
    const criteria = new DiscoverCriteria();
    criteria.language = language;
    criteria.region = 'fr';
    criteria.yearMin = debut;
    criteria.yearMax = fin;
    criteria.releaseType = [3, 2];
    const url = UrlBuilder.discoverUrlBuilder(criteria);
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
