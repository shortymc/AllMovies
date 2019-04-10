import { Data } from './data';
import { Score } from './score';
import { Keyword, ReleaseDate, AlternativeTitle, Lang } from './model';

export class Movie extends Data {
  public original_title: string;
  public date: string;
  public synopsis: string;
  public adult: boolean;
  public time: number;
  public note: number;
  public budget: number;
  public recette: number;
  public language: string;
  public videos: string[];
  public actors: string[];
  public crew: string[];
  public recommendations: Movie[];
  public images: string[];
  public popularity: number;
  public vote_count: number;
  public production_countries: string[];
  public imdb_id: string;
  public score: Score;
  public similars: Movie[];
  public keywords: Keyword[];
  public releaseDates: ReleaseDate[];
  public alternativeTitles: AlternativeTitle[];
  public spokenLangs: Lang[];
  public character: string;
  public updated: Date = new Date();
  constructor() {
    super();
  }

  removeFields(key: string, value: string): string {
    if (
      ['title', 'synopsis', 'actors', 'crew', 'recommendations', 'videos', 'images', 'checked', 'similars', 'affiche',
        'alternativeTitles', 'character', 'keywords', 'production_countries', 'releaseDates', 'spokenLangs', 'genres']
        .includes(key)
    ) {
      return undefined;
    }
    return value;
  }
}
