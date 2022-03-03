import {Utils} from './utils';
import {Season, Episode} from './../model/season';

export class MapSeason {
  static mapSeason(response: any): Season[] {
    return response.map(
      (r: any) =>
        <Season>{
          id: r.id,
          name: r.name,
          overview: r.overview,
          airDate: r.air_date,
          seasonNumber: r.season_number,
          episodeCount: r.episode_count,
          poster: r.poster_path,
        }
    );
  }

  static mapForSeasonDetail(r: any): Season {
    console.log(r);
    const season: Season = new Season();
    season.id = r.id;
    season.name = r.name;
    season.overview = r.overview;
    season.airDate = r.air_date;
    season.seasonNumber = r.season_number;
    season.poster = r.poster_path;
    let cast;
    if (r.credits) {
      cast = r.credits.cast.sort((a1: any, a2: any) => Utils.sortCast(a1, a2));
      season.crew = r.credits.crew;
    }
    if (cast) {
      season.actors = cast;
    }
    if (r.videos) {
      season.videos = r.videos.results;
    }
    if (r.images && r.images.posters.length > 0) {
      season.images = r.images.posters.map((i: any) => i.file_path);
    }
    if (r.episodes && r.episodes.length > 0) {
      season.episodeCount = r.episodes.length;
      season.episodes = r.episodes.map((e: any) => {
        const ep = new Episode();
        ep.id = e.id;
        ep.name = e.name;
        ep.overview = e.overview;
        ep.airDate = e.air_date;
        ep.episodeNumber = e.episode_number;
        ep.seasonNumber = e.season_number;
        ep.serieId = e.show_id;
        ep.poster = e.still_path;
        ep.guestStars = e.guest_stars;
        ep.crew = e.crew;
        ep.vote = e.vote_average;
        ep.vote_count = e.vote_count;
        return ep;
      });
    }
    console.log('season', season);
    return season;
  }
}
