import { Data } from './data';
import { Score } from './score';
import { Keyword, AlternativeTitle, Network } from './model';
import { Person } from './person';
import { Season } from './season';

export class Serie extends Data {
  originTitle: string;
  originLang: string;
  originCountries: string[];
  overview: string;
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
  popularity: number;
  vote: number;
  voteCount: number;
  score: Score;
  status: string;
  type: string;
  similars: Serie[];
  keywords: Keyword[];
  alternativeTitles: AlternativeTitle[];
  character: string;
  updated: Date = new Date();
  constructor() {
    super();
  }

  removeFields(key: string, value: string): string {
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
