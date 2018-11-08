import { Url } from './../constant/url';
import { Utils } from './utils';
import { Movie } from './../model/movie';
import { Discover } from '../model/discover';

export class MapMovie {

  static mapForMoviesByReleaseDates(response: any): Movie[] {
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

  static mapForPopularMovies(response: any): Movie[] {
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92)
    }));
  }

  static mapForDiscover(response: any): Discover {
    const discover = new Discover();
    discover.movies = response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      note: r.vote_average,
      language: r.original_language,
      thumbnail: Utils.getPosterPath(r, 92),
      affiche: Utils.getPosterPath(r, 0),
      adult: r.adult,
      original_title: Utils.getTitle(r),
      popularity: r.popularity,
      vote_count: r.vote_count
    }));
    discover.total_pages = response.total_pages;
    discover.page = response.page;
    discover.total_results = response.total_results;
    return discover;
  }

  static mapForSearchMovies(response: any): Movie[] {
    console.log(response.results);
    return response.results.slice(0, 5).map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      adult: r.adult,
      original_title: Utils.getTitle(r),
      thumbnail: Utils.getPosterPath(r, 0)
    }));
  }

  static mapForMovie(r: any): Movie {
    console.log(r);
    const movie = new Movie();
    let cast;
    if (r.credits) {
      cast = r.credits.cast.sort((a1: any, a2: any) => Utils.sortCast(a1, a2));
      movie.crew = r.credits.crew;
    }
    if (cast) {
      movie.actors = cast;
    }
    if (r.videos) {
      movie.videos = r.videos.results;
    }
    if (r.recommendations) {
      movie.recommendations = Utils.recommendationsToMovies(r.recommendations.results);
    }
    if (r.images && r.images.backdrops.length > 0) {
      movie.images = r.images.backdrops.map((i: any) => Url.IMAGE_URL_ORIGINAL.concat(i.file_path));
    }
    if (r.genres) {
      movie.genres = r.genres;
    }
    movie.id = r.id;
    movie.title = r.title;
    movie.original_title = r.original_title;
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
    movie.imdb_id = r.imdb_id;
    movie.checked = false;
    movie.production_countries = r.production_countries;
    console.log('movie', movie);
    return movie;
  }

  static toMovie(r: any): Movie {
    return <Movie>({
      id: r.id, title: r.title, original_title: Utils.getTitle(r), date: r.release_date, synopsis: r.overview,
      affiche: Utils.getPosterPath(r, 0), thumbnail: Utils.getPosterPath(r, 154), adult: false, note: r.vote_average
    });
  }
}
