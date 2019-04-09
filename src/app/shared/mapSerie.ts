import { AlternativeTitle, Lang, Flag, Genre } from '../model/model';
import { Utils } from './utils';
import { Serie } from '../model/serie';
import { Discover } from '../model/discover';
import { MockService } from './service/mock.service';

export class MapSerie {

  // static mapForPopularSeries(response: any): Serie[] {
  //   return response.results.map((r: any) => <Serie>({
  //     id: r.id,
  //     title: r.title,
  //     date: r.release_date,
  //     note: r.vote_average,
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
  //     note: r.vote_average,
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
      originTitle: Utils.getTitle(r, false),
      affiche: r.poster_path,
    }));
  }

  // static mapForRecommendationsSeries(reco: any): Serie[] {
  //   return reco.map((r: any) => <Serie>({
  //     id: r.id,
  //     title: r.title,
  //     date: r.release_date,
  //     affiche: r.poster_path,
  //     original_title: Utils.getTitle(r),
  //     adult: r.adult,
  //     time: r.runtime,
  //     note: r.vote_average,
  //     vote_count: r.vote_count,
  //     budget: r.budget,
  //     recette: r.revenue,
  //     language: r.original_language,
  //     popularity: r.popularity
  //   }));
  // }

  static mapForSerie(r: any, mockService: MockService<Flag>): Serie {
    console.log(r);
    const serie = new Serie();
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
      // serie.recommendations = MapSerie.mapForRecommendationsSeries(r.recommendations.results);
    }
    if (r.similar) {
      // serie.similars = MapSerie.mapForRecommendationsSeries(r.similar.results);
    }
    if (r.images && r.images.backdrops.length > 0) {
      serie.images = r.images.backdrops.map((i: any) => i.file_path);
    }
    if (r.genres) {
      serie.genres = r.genres;
    }
    if (r.keywords) {
      serie.keywords = r.keywords.keywords;
    }
    serie.title = r.title;
    if (r.alternative_titles && r.alternative_titles.titles) {
      serie.alternativeTitles = r.alternative_titles.titles
        .filter(title => title.title.toLowerCase() !== serie.title.toLowerCase())
        .map(title => new AlternativeTitle(title.iso_3166_1, title.title));
    }
    serie.id = r.id;
    serie.originTitle = r.original_title;
    // serie.date = r.release_date;
    serie.overview = r.overview;
    serie.affiche = r.poster_path;
    serie.runtimes = r.episode_run_time;
    serie.vote = r.vote_average;
    serie.voteCount = r.vote_count;
    // MapSerie.convertLangToCountry(r.original_language, mockService).then(code => serie.language = code);
    serie.checked = false;
    serie.popularity = r.popularity;
    console.log('serie', serie);
    return serie;
  }

  // static toSerie(r: any): Serie {
  //   return <Serie>({
  //     id: r.id,
  //     title: r.title,
  //     original_title: Utils.getTitle(r),
  //     date: r.release_date,
  //     synopsis: r.overview,
  //     affiche: r.poster_path,
  //     adult: r.adult,
  //     note: r.vote_average,
  //     vote_count: r.vote_count,
  //     language: r.original_language,
  //     popularity: r.popularity,
  //     character: r.character
  //   });
  // }
}
