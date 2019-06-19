import { AlternativeTitle, Lang, Flag, Genre } from './../model/model';
import { Utils } from './utils';
import { Movie } from './../model/movie';
import { Discover } from '../model/discover';
import { ReleaseDate } from '../model/model';
import { MockService } from './service/mock.service';

export class MapMovie {

  private static flags: Flag[] = [];

  static mapForMoviesByReleaseDates(response: any): Movie[] {
    console.log(response.results);
    return response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      vote: r.vote_average,
      language: r.original_language,
      affiche: r.poster_path,
      overview: r.overview,
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
      vote: r.vote_average,
      language: r.original_language,
      affiche: r.poster_path,
      popularity: r.popularity
    }));
  }

  static mapForDiscover(response: any): Discover {
    const discover = new Discover();
    discover.datas = response.results.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      vote: r.vote_average,
      language: r.original_language,
      affiche: r.poster_path,
      adult: r.adult,
      original_title: Utils.getTitle(r),
      popularity: r.popularity,
      vote_count: r.vote_count,
      genres: r.genre_ids.map(g => {
        const genre = new Genre();
        genre.id = g;
        return genre;
      })
    }));
    discover.total_pages = response.total_pages;
    discover.page = response.page;
    discover.total_results = response.total_results;
    console.log('discover', discover);
    return discover;
  }

  static mapForSearchMovies(response: any): Movie[] {
    console.log(response.results);
    return response.results.slice(0, 6).map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      adult: r.adult,
      original_title: Utils.getTitle(r),
      affiche: r.poster_path,
    }));
  }

  static mapForRecommendationsMovies(reco: any): Movie[] {
    return reco.map((r: any) => <Movie>({
      id: r.id,
      title: r.title,
      date: r.release_date,
      affiche: r.poster_path,
      original_title: Utils.getTitle(r),
      adult: r.adult,
      time: r.runtime,
      vote: r.vote_average,
      vote_count: r.vote_count,
      budget: r.budget,
      recette: r.revenue,
      language: r.original_language,
      popularity: r.popularity
    }));
  }

  static mapForMovie(r: any, mockService: MockService<Flag>): Movie {
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
      movie.recommendations = MapMovie.mapForRecommendationsMovies(r.recommendations.results);
    }
    if (r.similar) {
      movie.similars = MapMovie.mapForRecommendationsMovies(r.similar.results);
    }
    if (r.images && r.images.backdrops.length > 0) {
      movie.images = r.images.backdrops.map((i: any) => i.file_path);
    }
    if (r.genres) {
      movie.genres = r.genres;
    }
    if (r.keywords) {
      movie.keywords = r.keywords.keywords;
    }
    if (r.release_dates && r.release_dates.results) {
      const release = r.release_dates.results.find(date => date.iso_3166_1 === 'FR');
      if (release && release.release_dates) {
        movie.releaseDates = release.release_dates.map(date => new ReleaseDate(date.release_date, date.type));
      }
    }
    if (r.spoken_languages) {
      movie.spokenLangs = r.spoken_languages.map(spoken => {
        const lang = new Lang();
        MapMovie.convertLangToCountry(spoken.iso_639_1, mockService).then(code => lang.code = code);
        lang.label = spoken.name;
        return lang;
      });
    }
    movie.title = r.title;
    if (r.alternative_titles && r.alternative_titles.titles) {
      movie.alternativeTitles = r.alternative_titles.titles
        .filter(title => title.title.toLowerCase() !== movie.title.toLowerCase())
        .map(title => new AlternativeTitle(title.iso_3166_1, title.title));
    }
    movie.id = r.id;
    movie.original_title = r.original_title;
    movie.date = r.release_date;
    movie.overview = r.overview;
    movie.affiche = r.poster_path;
    movie.adult = r.adult;
    movie.time = r.runtime;
    movie.vote = r.vote_average;
    movie.vote_count = r.vote_count;
    movie.budget = r.budget;
    movie.recette = r.revenue;
    MapMovie.convertLangToCountry(r.original_language, mockService).then(code => movie.language = code);
    movie.imdb_id = r.imdb_id;
    movie.checked = false;
    movie.production_countries = r.production_countries;
    movie.popularity = r.popularity;
    console.log('movie', movie);
    return movie;
  }

  static convertLangToCountry(code: string, mockService: MockService<Flag>): Promise<string> {
    if (!MapMovie.flags || MapMovie.flags.length === 0) {
      return mockService.getAll('flags.json').then(flags => {
        MapMovie.flags = flags;
        return MapMovie.getFlag(code);
      });
    } else {
      return new Promise((resolve) => resolve(MapMovie.getFlag(code)));
    }
  }

  static getFlag(code: string): string {
    if (MapMovie.flags.map(flag => flag.lang).includes(code)) {
      return MapMovie.flags.find(flag => flag.lang === code).country;
    } else {
      return code;
    }
  }

  static toMovie(r: any): Movie {
    return <Movie>({
      id: r.id,
      title: r.title,
      original_title: Utils.getTitle(r),
      date: r.release_date,
      overview: r.overview,
      affiche: r.poster_path,
      adult: r.adult,
      vote: r.vote_average,
      vote_count: r.vote_count,
      language: r.original_language,
      popularity: r.popularity,
      character: r.character,
      isMovie: true
    });
  }

  static mapForList(resp: any): Movie[] {
    return resp.map((r: any) => <Movie>({
      affiche: r.poster_path,
      adult: r.adult,
      overview: r.overview,
      date: r.release_date,
      original_title: Utils.getTitle(r),
      genres: r.genre_ids.map(g => {
        const genre = new Genre();
        genre.id = g;
        return genre;
      }),
      id: r.id,
      language: r.original_language,
      title: r.title,
      popularity: r.popularity,
      vote_count: r.vote_count,
      videos: r.video,
      vote: r.vote_average,
    }));
  }
}
