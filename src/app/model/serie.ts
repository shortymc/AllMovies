import { Data } from './data';
import { Network } from './model';
import { Person } from './person';
import { Season } from './season';

export class Serie extends Data {
  originLang: string;
  originCountries: string[];
  creators: Person[];
  runtimes: number[];
  firstAired: Date;
  lastAired: Date;
  inProduction: boolean;
  languages: string[];
  recommendations: Serie[];
  networks: Network[];
  episodeCount: number;
  seasonCount: number;
  seasons: Season[];
  status: string;
  type: string;
  similars: Serie[];

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
