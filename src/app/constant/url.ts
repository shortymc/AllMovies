export class Url {
  // API MovieDB request
  static readonly API_KEY = 'api_key=81c50d6514fbd578f0c796f8f6ecdafd';
  static readonly MOVIE_DB_API_BASE_URL = 'https://api.themoviedb.org/';
  static readonly MOVIE_DB_API_URL = Url.MOVIE_DB_API_BASE_URL + '3/';
  static readonly MOVIE_DB_API_URL_4 = Url.MOVIE_DB_API_BASE_URL + '4/';
  static readonly MOVIE_URl = Url.MOVIE_DB_API_URL + 'movie';
  static readonly SERIE_URl = Url.MOVIE_DB_API_URL + 'tv';
  static readonly PERSON_URL = Url.MOVIE_DB_API_URL + 'person';
  static readonly MOVIE_SEARCH_URL = Url.MOVIE_DB_API_URL + 'search/movie?';
  static readonly SERIE_SEARCH_URL = Url.MOVIE_DB_API_URL + 'search/tv?';
  static readonly PERSON_SEARCH_URL = Url.MOVIE_DB_API_URL + 'search/person?';
  static readonly KEYWORD_SEARCH_URL = Url.MOVIE_DB_API_URL + 'search/keyword?';
  static readonly KEYWORD_URL = Url.MOVIE_DB_API_URL + 'keyword/';
  static readonly SEASON_URL = '/season/';
  static readonly MOVIE_CREDITS_URL = 'movie_credits';
  static readonly REGION = '&region=';
  static readonly LANGUE = '&language=';
  static readonly LANGUE_FR = '&language=fr';
  static readonly ADULT_URL = '&include_adult=true';
  static readonly QUERY_URL = '&query=';

  // APPEND
  static readonly APPEND = '&append_to_response=';
  static readonly APPEND_VIDEOS = 'videos';
  static readonly APPEND_CREDITS = 'credits';
  static readonly APPEND_COMBINED_CREDITS = 'combined_credits';
  static readonly APPEND_IMAGES = 'images';
  static readonly APPEND_KEYWORDS = 'keywords';
  static readonly APPEND_ALTERNATIVE_TITLES = 'alternative_titles';
  static readonly APPEND_RECOMMENDATIONS = 'recommendations';
  static readonly APPEND_RELEASE_DATE = 'release_dates';
  static readonly APPEND_SIMILARS = 'similar';
  static readonly APPEND_TRANSLATIONS = 'translations';
  static readonly APPEND_EXTERNAL_IDS = 'external_ids';

  static readonly INCLUDE_IMAGE_LANGUAGE = '&include_image_language=';
  static readonly RELEASE_DATE_GTE_URL = '&release_date.gte=';
  static readonly RELEASE_DATE_LTE_URL = '&release_date.lte=';
  static readonly FIRST_AIR_DATE_GTE_URL = '&first_air_date.gte=';
  static readonly FIRST_AIR_DATE_LTE_URL = '&first_air_date.lte=';
  static readonly RELEASE_TYPE_URL = '&with_release_type=3|2';
  static readonly DISCOVER_MOVIE_URL =
    Url.MOVIE_DB_API_URL + 'discover/movie?' + Url.API_KEY;
  static readonly DISCOVER_SERIE_URL =
    Url.MOVIE_DB_API_URL + 'discover/tv?' + Url.API_KEY;
  static readonly PLAYING_URL =
    Url.MOVIE_DB_API_URL + 'movie/now_playing?' + Url.API_KEY;
  static readonly MOST_POPULAR_MOVIE_URL = Url.DISCOVER_MOVIE_URL + '&sort_by=popularity.desc';
  static readonly MOST_POPULAR_SERIE_URL = Url.DISCOVER_SERIE_URL + '&sort_by=popularity.desc';
  static readonly SORT_BY_URL = '&sort_by=';
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
  static readonly WITH_NETWORKS_URL = '&with_networks=';
  static readonly WITH_PEOPLE_URL = '&with_people=';
  static readonly WITH_ORIGINAL_LANGUAGE = '&with_original_language=';
  static readonly WITHOUT_GENRES_URL = '&without_genres=';
  static readonly WITHOUT_KEYWORDS_URL = '&without_keywords=';
  static readonly GET_MOVIE_GENRES_URL = Url.MOVIE_DB_API_URL + 'genre/movie/list?';
  static readonly GET_SERIE_GENRES_URL = Url.MOVIE_DB_API_URL + 'genre/tv/list?';
  static readonly GET_ALL_CERTIFICATIONS_URL = Url.MOVIE_DB_API_URL + 'certification/movie/list?';
  static readonly GET_ALL_LANGS_URL = Url.MOVIE_DB_API_URL + 'configuration/languages?';
  static readonly GET_POPULAR_PERSON = Url.MOVIE_DB_API_URL + 'person/popular?' + Url.API_KEY;

  static readonly GET_MOVIE_LISTS = 'lists';
  static readonly GET_LISTS_DETAILS = Url.MOVIE_DB_API_URL_4 + 'list/';
}
