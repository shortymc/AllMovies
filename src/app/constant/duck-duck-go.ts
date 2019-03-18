import { faDatabase, faFilm } from '@fortawesome/free-solid-svg-icons';
import { faImdb, faWikipediaW } from '@fortawesome/free-brands-svg-icons';

export class DuckDuckGo {
  static readonly SEARCH_BANG_METACRITIC = { site: 'metacritic', icon: faDatabase };
  static readonly SEARCH_BANG_SENSCRITIQUE = { site: 'scq', icon: faFilm };
  static readonly SEARCH_BANG_IMDB = { site: 'imdb', icon: faImdb };
  static readonly SEARCH_BANG_WIKI_EN = { site: 'wen', icon: faWikipediaW };
  static readonly SEARCH_BANG_WIKI_FR = { site: 'wikifr', icon: faWikipediaW };
  static readonly DUCKDUCKGO_URL = 'https://api.duckduckgo.com/?q=!';
}
