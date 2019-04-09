import { Season } from './../model/season';

export class MapSeason {

  static mapSeason(response: any): Season[] {
    return response.map((r: any) => <Season>({
      id: r.id,
      name: r.name,
      overview: r.overview,
      airDate: r.air_date,
      seasonNumber: r.season_number,
      episodeCount: r.episode_count,
      poster: r.poster_path
    }));
  }
}
