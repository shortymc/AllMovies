export class Url {
  // Image
  static readonly IMAGE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
  static readonly IMAGE_URL_154 = 'https://image.tmdb.org/t/p/w154';
  static readonly IMAGE_URL_92 = 'https://image.tmdb.org/t/p/w92';
  static readonly IMAGE_URL_EMPTY = './assets/empty.jpg';

  // DUCK DUCK GO
  static readonly SEARCH_BANG_METACRITIC = { site: 'metacritic', icon: 'fa-database' };
  static readonly SEARCH_BANG_SENSCRITIQUE = { site: 'scq', icon: 'fa-film' };
  static readonly SEARCH_BANG_IMDB = { site: 'imdb', icon: 'fa-imdb' };
  static readonly SEARCH_BANG_WIKI_EN = { site: 'wen', icon: 'fa-wikipedia-w' };
  static readonly SEARCH_BANG_WIKI_FR = { site: 'wikifr', icon: 'fa-wikipedia-w' };
  static readonly DUCKDUCKGO_URL = 'https://api.duckduckgo.com/?q=!';

  // API MovieDB request
  static readonly API_KEY = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
  static readonly MOVIE_URl = 'https://api.themoviedb.org/3/movie';
  static readonly PERSON_URL = 'https://api.themoviedb.org/3/person';
  static readonly MOVIE_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?';
  static readonly PERSON_SEARCH_URL = 'https://api.themoviedb.org/3/search/person?';
  static readonly MOVIE_CREDITS_URL = 'movie_credits';
  static readonly LANGUE = '&language=';
  static readonly LANGUE_FR = '&language=fr';
  static readonly ADULT_URL = '&include_adult=true';
  static readonly QUERY_URL = '&query=';
  static readonly APPEND = '&append_to_response=';
  static readonly APPEND_VIDEOS = 'videos';
  static readonly APPEND_CREDITS = 'credits';
  static readonly APPEND_IMAGES = 'images';
  static readonly INCLUDE_IMAGE_LANGUAGE = '&include_image_language=';
  static readonly APPEND_RECOMMENDATIONS = 'recommendations';
  static readonly RELEASE_DATE_GTE_URL = '&release_date.gte=';
  static readonly RELEASE_DATE_LTE_URL = '&release_date.lte=';
  static readonly RELEASE_TYPE_URL = '&with_release_type=3|2';
  static readonly DISCOVER_URL =
    'https://api.themoviedb.org/3/discover/movie?' + Url.API_KEY + '&region=FR';
  static readonly MOST_POPULAR_URL = Url.DISCOVER_URL + '&sort_by=popularity.desc';
  static readonly PAGE_URL = '&page=';
  static readonly VOTE_COUNT_GTE_URL = '&vote_count.gte=';
  static readonly VOTE_COUNT_LTE_URL = '&vote_count.lte=';
  static readonly VOTE_AVERAGE_GTE_URL = '&vote_average.gte=';
  static readonly VOTE_AVERAGE_LTE_URL = '&vote_average.lte=';
  static readonly CERTIFICATION_COUNTRY_URL = '&certification_country=FR';
  static readonly CERTIFICATION_URL = '&certification=';
  static readonly AND_URL = ',';
  static readonly OR_URL = '|';
  static readonly WITH_RUNTIME_GTE_URL = '&with_runtime.gte=';
  static readonly WITH_RUNTIME_LTE_URL = '&with_runtime.lte=';
  static readonly WITH_RELEASE_TYPE_URL = '&with_release_type=';
  static readonly WITH_GENRES_URL = '&with_genres=';
  static readonly WITH_KEYWORDS_URL = '&with_keywords=';
  static readonly WITH_PEOPLE_URL = '&with_people=';
  static readonly WITHOUT_GENRES_URL = '&without_genres=';
  static readonly WITHOUT_KEYWORDS_URL = '&without_keywords=';

  // Release types
  static readonly RELEASE_PREMIERE = '1';
  static readonly RELEASE_THEATRICAL_LIMITED = '2';
  static readonly RELEASE_THEATRICAL = '3';
  static readonly RELEASE_DIGITAL = '4';
  static readonly RELEASE_PHYSICAL = '5';
  static readonly RELEASE_TV = '6';

  // DropBox
  static readonly DROPBOX_TOKEN = 'G-_ZeiEAvB0AAAAAAAANQd4IMHRr7Y9aTvAiivg-8LImbDKmo9pdu95_SIioW3lR';
  static readonly DROPBOX_FOLDER = '/MyMovies/';
  static readonly DROPBOX_USER_FILE = 'user.json';
  static readonly DROPBOX_FILE_PREFIX = 'ex_';
  static readonly DROPBOX_FILE_SUFFIX = '.json';

  // API OMDB_API
  static readonly OMDB_API_KEY = '&apikey=5dc08d05';
  static readonly OMDB_URL = 'http://www.omdbapi.com/';
  static readonly OMDB_ID = '?i=';
}
