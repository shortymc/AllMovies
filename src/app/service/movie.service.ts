import { Utils } from './../shared/utils';
import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class MovieService {

  constructor(private serviceUtils: ServiceUtils) { }

  getMovies(language: string): Promise<Movie[]> {
    return this.serviceUtils.http.get(`${Url.MOST_POPULAR_URL}${Url.LANGUE}${language}`)
      .toPromise()
      .then(response => this.mapMoviesDT(response))
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
      .then(response => this.mapMovie(response))
      .catch(this.serviceUtils.handleError);
  }

  getMoviesByReleaseDates(debut: string, fin: string, language: string): Promise<Movie[]> {
    const url =
  `${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}${Url.LANGUE}${language}`;
    return this.serviceUtils.http.get(url)
      .toPromise()
      .then(response => this.mapMovies(response))
      .catch(this.serviceUtils.handleError);
  }

  mapMovies(response: any): Movie[] {
    console.log(response.results);
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92),
      affiche: Utils.getPosterPath(r, 0),
      synopsis: r.overview,
      time: r.runtime,
      popularity: r.popularity,
      vote_count: r.vote_count
    }));
  }

  mapMoviesDT(response: any): Movie[] {
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92)
    }));
  }

  recommendationsToMovies(reco: any): Movie[] {
    return reco.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      thumbnail: Utils.getPosterPath(r, 92),
      original_title: Utils.getTitle(r),
      adult: r.adult,
      time: r.runtime,
      note: r.vote_average,
      budget: r.budget,
      recette: r.revenue,
      language: r.original_language
    }));
  }

  mapMovie(r: any): Movie {
    console.log(r);
    const movie = new Movie();
    let cast;
    if (r.credits) {
      cast = r.credits.cast.sort((a1: any, a2: any) => this.sortCast(a1, a2));
      movie.crew = r.credits.crew;
    }
    if (cast) {
      movie.actors = cast;
    }
    if (r.videos) {
      movie.videos = r.videos.results;
    }
    if (r.recommendations) {
      movie.recommendations = this.recommendationsToMovies(r.recommendations.results);
    }
    if (r.images) {
      movie.images = r.images.backdrops.map((i: any) => i.file_path);
    }
    if (r.genres) {
      movie.genres = r.genres.map(genre => genre.name);
    }
    movie.id = r.id;
    movie.title = r.title;
    movie.original_title = Utils.getTitle(r);
    movie.date = r.release_date;
    movie.synopsis = r.overview;
    movie.affiche = Utils.getPosterPath(r, 0);
    movie.thumbnail = Utils.getPosterPath(r, 154);
    movie.adult = r.adult;
    movie.time = r.runtime;
    movie.note = r.vote_average;
    movie.budget = r.budget;
    movie.recette = r.revenue;
    movie.language = r.original_language;
    movie.checked = false;
    movie.production_countries = r.production_countries;
    return movie;
  }

  sortCast(a1: any, a2: any) {
    if (a1.cast_id < a2.cast_id) {
      return -1;
    } else if (a1.cast_id > a2.cast_id) {
      return 1;
    } else {
      return 0;
    }
  }
}
