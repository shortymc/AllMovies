import { ServiceUtils } from './serviceUtils';
import { Injectable } from '@angular/core';
import { Movie } from '../model/movie';
import { Url } from '../constant/url';

@Injectable()
export class MovieService {

  constructor(private utils: ServiceUtils) { }

  getMovies(): Promise<Movie[]> {
    return this.utils.http.get(Url.MOST_POPULAR_URL)
      .toPromise()
      .then(response => this.mapMoviesDT(response))
      .catch(this.utils.handleError);
  }

  getMovie(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean): Promise<Movie> {
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
    return this.utils.http.get(url)
      .toPromise()
      .then(response => this.mapMovie(response))
      .catch(this.utils.handleError);
  }

  getMoviesByReleaseDates(debut: string, fin: string): Promise<Movie[]> {
    const url = `${Url.DISCOVER_URL}${Url.RELEASE_DATE_GTE_URL}${debut}${Url.RELEASE_DATE_LTE_URL}${fin}${Url.RELEASE_TYPE_URL}`;
    return this.utils.http.get(url)
      .toPromise()
      .then(response => this.mapMovies(response))
      .catch(this.utils.handleError);
  }

  mapMovies(response: any): Movie[] {
    console.log(response.results);
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Url.IMAGE_URL_92 + r.poster_path,
      affiche: Url.IMAGE_URL_ORIGINAL + r.poster_path,
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
      thumbnail: r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_92 + r.poster_path
    }));
  }

  recommendationsToMovies(reco: any): Movie[] {
    return reco.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      thumbnail: Url.IMAGE_URL_92 + r.poster_path,
      original_title: r.original_title,
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
    let cast;
    let crew;
    if (r.credits !== null && r.credits !== undefined) {
      cast = r.credits.cast.sort((a1: any, a2: any) => this.sortCast(a1, a2));
      crew = r.credits.crew;
    }
    if (cast !== undefined) {
      cast = cast;
    }
    let videos;
    if (r.videos !== null && r.videos !== undefined) {
      videos = r.videos.results;
    }
    let reco;
    if (r.recommendations !== null && r.recommendations !== undefined) {
      reco = this.recommendationsToMovies(r.recommendations.results);
    }
    let img;
    if (r.images !== null && r.images !== undefined) {
      img = r.images.backdrops.map((i: any) => i.file_path);
    }
    let genres;
    if (r.genres !== null && r.genres !== undefined) {
      genres = r.genres.map(genre => genre.name);
    }
    return new Movie(r.id, r.title, r.original_title === r.title ? '' : r.original_title, r.release_date, r.overview,
      r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_ORIGINAL + r.poster_path,
      r.poster_path === null ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_154 + r.poster_path,
      r.adult, r.runtime, r.vote_average, r.budget, r.revenue, r.original_language,
      videos, cast, crew, reco, img, false, genres, undefined, undefined, r.production_countries);
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
