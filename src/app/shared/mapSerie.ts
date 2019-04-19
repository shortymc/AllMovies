import { MapSeason } from './mapSeason';
import { AlternativeTitle } from '../model/model';
import { Utils } from './utils';
import { Serie } from '../model/serie';

export class MapSerie {

  // static mapForPopularSeries(response: any): Serie[] {
  //   return response.results.map((r: any) => <Serie>({
  //     id: r.id,
  //     title: r.title,
  //     date: r.release_date,
  //     vote: r.vote_average,
  //     language: r.original_language,
  //     affiche: r.poster_path,
  //     popularity: r.popularity
  //   }));
  // }

  // static mapForDiscover(response: any): Discover {
  //   const discover = new Discover();
  //   discover.series = response.results.map((r: any) => <Serie>({
  //     id: r.id,
  //     title: r.title,
  //     date: r.release_date,
  //     vote: r.vote_average,
  //     language: r.original_language,
  //     affiche: r.poster_path,
  //     adult: r.adult,
  //     original_title: Utils.getTitle(r),
  //     popularity: r.popularity,
  //     vote_count: r.vote_count,
  //     genres: r.genre_ids.map(g => {
  //       const genre = new Genre();
  //       genre.id = g;
  //       return genre;
  //     })
  //   }));
  //   discover.total_pages = response.total_pages;
  //   discover.page = response.page;
  //   discover.total_results = response.total_results;
  //   console.log('discover', discover);
  //   return discover;
  // }

  static mapForSearchSeries(response: any): Serie[] {
    console.log(response.results);
    return response.results.slice(0, 6).map((r: any) => <Serie>({
      id: r.id,
      title: r.name,
      firstAired: r.first_air_date,
      original_title: Utils.getTitle(r, false),
      affiche: r.poster_path,
    }));
  }

  static mapForRecommendationsSeries(reco: any): Serie[] {
    return reco.map((r: any) => <Serie>({
      id: r.id,
      title: r.name,
      firstAired: r.first_air_date,
      affiche: r.poster_path,
      original_title: Utils.getTitle(r),
      vote: r.vote_average,
      vote_count: r.vote_count,
      originLang: r.original_language,
      popularity: r.popularity
    }));
  }

  static mapForSerie(r: any): Serie {
    console.log(r);
    const serie = new Serie();
    serie.id = r.id;
    serie.title = r.name;
    serie.original_title = r.original_name;
    serie.originLang = r.original_language;
    serie.originCountries = r.origin_country;
    serie.overview = r.overview;
    serie.affiche = r.poster_path;
    serie.runtimes = r.episode_run_time;
    serie.vote = r.vote_average;
    serie.vote_count = r.vote_count;
    serie.checked = false;
    serie.popularity = r.popularity;
    serie.status = r.status;
    serie.type = r.type;
    serie.seasonCount = r.number_of_seasons;
    serie.episodeCount = r.number_of_episodes;
    serie.languages = r.languages;
    serie.inProduction = r.in_production;
    serie.firstAired = r.first_air_date;
    serie.lastAired = r.last_air_date;
    serie.runtimes = r.episode_run_time;
    if (r.external_ids) {
      serie.imdb_id = r.external_ids.imdb_id;
    }
    if (r.created_by) {
      serie.creators = r.created_by;
    }
    if (r.networks) {
      serie.networks = r.networks;
    }
    if (r.seasons) {
      serie.seasons = MapSeason.mapSeason(r.seasons);
    }
    let cast;
    if (r.credits) {
      cast = r.credits.cast.sort((a1: any, a2: any) => Utils.sortCast(a1, a2));
      serie.crew = r.credits.crew;
    }
    if (cast) {
      serie.actors = cast;
    }
    if (r.videos) {
      serie.videos = r.videos.results;
    }
    if (r.recommendations) {
      serie.recommendations = MapSerie.mapForRecommendationsSeries(r.recommendations.results);
    }
    if (r.similar) {
      serie.similars = MapSerie.mapForRecommendationsSeries(r.similar.results);
    }
    if (r.images && r.images.backdrops.length > 0) {
      serie.images = r.images.backdrops.map((i: any) => i.file_path);
    }
    if (r.genres) {
      serie.genres = r.genres;
    }
    if (r.keywords) {
      serie.keywords = r.keywords.results;
    }
    if (r.alternative_titles && r.alternative_titles.results) {
      serie.alternativeTitles = r.alternative_titles.results
        .filter(title => title.title.toLowerCase() !== serie.title.toLowerCase())
        .map(title => new AlternativeTitle(title.iso_3166_1, title.title));
    }
    console.log('serie', serie);
    return serie;
  }

  static toSerie(r: any): Serie {
    return <Serie>({
      id: r.id,
      title: r.name,
      original_title: r.original_name,
      firstAired: r.first_air_date,
      overview: r.overview,
      affiche: r.poster_path,
      vote: r.vote_average,
      vote_count: r.vote_count,
      originLang: r.original_language,
      popularity: r.popularity,
      character: r.character,
      episodeCount: r.number_of_episodes,
      originCountries: r.origin_country,
      isMovie: false
    });
  }
}
