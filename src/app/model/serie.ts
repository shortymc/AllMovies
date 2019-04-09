import { Utils } from '../shared/utils';
import { Score } from './score';
import { Genre, Keyword, ReleaseDate, AlternativeTitle, Network } from './model';
import { Person } from './person';
import { Season } from './season';

export class SerieI18N {
  constructor(public name: string, public poster: string, public category: Genre[]) {
  }
}

export class Serie {
  id: number;
  title: string;
  translation: Map<string, SerieI18N>; // key: lang
  originTitle: string;
  originLang: string;
  originCountries: string[];
  overview: string;
  affiche: string;
  creators: Person[];
  runtimes: number[];
  firstAired: Date;
  lastAired: Date;
  inProduction: boolean;
  languages: string[];
  videos: string[];
  actors: string[];
  crew: string[];
  recommendations: Serie[];
  networks: Network[];
  episodeCount: number;
  seasonCount: number;
  images: string[];
  seasons: Season[];
  checked: boolean;
  genres: Genre[];
  popularity: number;
  vote: number;
  voteCount: number;
  lang_version = 'fr';
  added: Date = new Date();
  score: Score;
  status: string;
  type: string;
  similars: Serie[];
  keywords: Keyword[];
  alternativeTitles: AlternativeTitle[];
  character: string;
  updated: Date = new Date();
  constructor() { }

  static toJson(series: Serie[]): string {
    return '[' + series.map(serie => {
      const translation = Utils.mapToJson(<Map<any, any>>serie.translation);
      const json = JSON.stringify(serie, Serie.removeFields);
      return json.replace('"translation":{}', '"translation":' + translation);
    }).join(',') + ']';
  }

  static fromJson(json: string): Serie[] {
    if (json && json.trim().length > 0) {
      const series = <Serie[]>JSON.parse(json);
      series.forEach(m => {
        const mapResult = new Map();
        m.translation.forEach(tr => mapResult.set(tr[0], tr[1]));
        m.translation = mapResult;
      });
      return series;
    } else {
      return [];
    }
  }

  static seriesToBlob(series: Serie[]): Blob {
    const theJSON = Serie.toJson(series);
    return new Blob([theJSON], { type: 'text/json' });
  }

  static removeFields(key: string, value: string): string {
    if (
      ['title', 'overview', 'actors', 'crew', 'recommendations', 'videos', 'images', 'checked', 'similars', 'affiche',
        'alternativeTitles', 'character', 'keywords', 'originCountries', 'genres', 'networks', 'seasons']
        .includes(key)
    ) {
      return undefined;
    }
    return value;
  }
}
