import { Data } from './data';
import { ReleaseDate, Lang } from './model';

export class Movie extends Data {
  date: string;
  adult: boolean;
  time: number;
  budget: number;
  recette: number;
  language: string;
  recommendations: Movie[];
  production_countries: string[];
  similars: Movie[];
  releaseDates: ReleaseDate[];
  spokenLangs: Lang[];

  constructor() {
    super();
  }

  removeFields(key: string, value: string): string {
    if (
      ['title', 'overview', 'actors', 'crew', 'recommendations', 'videos', 'images', 'checked', 'similars', 'affiche',
        'alternativeTitles', 'character', 'keywords', 'production_countries', 'releaseDates', 'spokenLangs', 'genres', 'isMovie']
        .includes(key)
    ) {
      return undefined;
    }
    return value;
  }
}
