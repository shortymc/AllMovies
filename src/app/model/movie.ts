import { Utils } from './../shared/utils';
import { Score } from './score';
import { Genre, Keyword, ReleaseDate, AlternativeTitle, Lang } from './model';

export class MovieI18N {
  constructor(public name: string, public poster: string, public category: Genre[]) {
  }
}

export class Movie {
  public id: number;
  public title: string;
  public translation: Map<string, MovieI18N>; // key: lang
  public original_title: string;
  public date: string;
  public synopsis: string;
  public affiche: string;
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
  public checked: boolean;
  public genres: Genre[];
  public popularity: number;
  public vote_count: number;
  public production_countries: string[];
  public lang_version = 'fr';
  public added: Date = new Date();
  public imdb_id: string;
  public score: Score;
  public similars: Movie[];
  public keywords: Keyword[];
  public releaseDates: ReleaseDate[];
  public alternativeTitles: AlternativeTitle[];
  public spokenLangs: Lang[];
  public character: string;
  public updated: Date = new Date();
  public tags: number[];
  constructor() { }

  static toJson(movies: Movie[]): string {
    return '[' + movies.map(movie => {
      const translation = Utils.mapToJson(<Map<any, any>>movie.translation);
      const json = JSON.stringify(movie, Movie.removeFields);
      return json.replace(',"translation":{}', ',"translation":' + translation);
    }).join(',') + ']';
  }

  static fromJson(json: string): Movie[] {
    if (json && json.trim().length > 0) {
      const movies = <Movie[]>JSON.parse(json);
      movies.forEach(m => {
        const mapResult = new Map();
        m.translation.forEach(tr => mapResult.set(tr[0], tr[1]));
        m.translation = mapResult;
      });
      return movies;
    } else {
      return [];
    }
  }

  static moviesToBlob(movies: Movie[]): Blob {
    const theJSON = Movie.toJson(movies);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: string, value: string): string {
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
