import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';

import { DiscoverCriteria } from './../../model/discover-criteria';
import { Discover } from './../../model/discover';
import { MapMovie } from './../../shared/mapMovie';
import { MockService } from './mock.service';
import { UtilsService } from './utils.service';
import { Movie } from '../../model/movie';
import { MovieDetailConfig, Flag } from './../../model/model';
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
    private mockService: MockService<Flag>
  ) { }

  getPopularMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.getPromise(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .then(response => MapMovie.mapForPopularMovies(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMovies(ids: number[], language: string): Promise<Movie[]> {
    const obs = ids.map(id => this.getMovie(id, new MovieDetailConfig(true, true, true, true, true, true, true, true, language), false));
    return forkJoin(obs).toPromise();
  }

  getMovie(id: number, config: MovieDetailConfig, detail: boolean): Promise<Movie> {
    return this.serviceUtils.getPromise(UrlBuilder.movieUrlBuilder(id, config.video, config.credit,
      config.reco, config.release, config.keywords, config.similar, config.img, config.titles, config.lang))
      .then(response => {
        const movie = MapMovie.mapForMovie(response, this.mockService);
        movie.lang_version = config.lang;
        if (detail && (!movie.synopsis || (!movie.videos && config.video) || !movie.original_title)) {
          return this.getMovie(id,
            new MovieDetailConfig(false, false, false, false, config.video, false, false, false, 'en'), false).then(enMovie => {
              movie.synopsis = Utils.isBlank(movie.synopsis) ? enMovie.synopsis : movie.synopsis;
              movie.videos = movie.videos && movie.videos.length > 0 ? movie.videos : enMovie.videos;
              movie.original_title = Utils.isBlank(movie.original_title) ? enMovie.original_title : movie.original_title;
              movie.score = enMovie.score;
              return movie;
            });
        } else {
          return this.getImdbScore(movie);
        }
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getImdbScore(movie: Movie): Promise<Movie> {
    if (movie.imdb_id) {
      return this.omdb.getScore(movie.imdb_id).then(score => {
        if (score) {
          score.ratings.splice(-1, 0, ...[{ Source: 'MovieDB', Value: movie.note + '/10' }, { Source: 'Popularity', Value: movie.popularity }]);
          score.moviedb_votes = movie.vote_count;
          movie.score = score;
        }
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
    criteria.runtimeMin = 60;
    const url = UrlBuilder.discoverUrlBuilder(criteria, undefined, undefined, undefined);
    return this.serviceUtils.getPromise(url)
      .then(response => MapMovie.mapForMoviesByReleaseDates(response))
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMoviesDiscover(criteria: DiscoverCriteria, people: number[], genre: number[], keyword: number[]): Promise<Discover> {
    return this.serviceUtils.getPromise(
      UrlBuilder.discoverUrlBuilder(criteria, people, genre, keyword))
      .then((response: any) => {
        const discover = MapMovie.mapForDiscover(response);
        // discover.movies.forEach((movie) => this.omdb.getMovie(movie.imdb_id).then(score => movie.score = score));
        return discover;
      }).catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

  getMoviesPlaying(criteria: DiscoverCriteria): Promise<string[]> {
    return this.serviceUtils.getPromise(
      UrlBuilder.playingUrlBuilder(criteria))
      .then((response: any) => [response.dates.minimum, response.dates.maximum])
      .catch((err) => this.serviceUtils.handlePromiseError(err, this.toast));
  }

}
