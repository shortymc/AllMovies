import { DiscoverCriteria } from './../model/discover-criteria';
import { Url } from './../constant/url';

export class UrlBuilder {

  static personUrlBuilder(id: number, language: string, images: boolean, credits: boolean): string {
    let url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}`;
    if (images || credits) {
      url += `${Url.APPEND}`;
      const parametres: string[] = [];
      if (images) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      if (credits) {
        parametres.push(`${Url.APPEND_COMBINED_CREDITS}`);
      }
      url += parametres.join(',');
    }
    url = UrlBuilder.langUrlBuilder(url, language);
    console.log('personUrlBuilder', url);
    return url;
  }

  static seasonUrlBuilder(id: number, season: number, language: string, images: boolean, credits: boolean, videos: boolean): string {
    let url = `${Url.SERIE_URl}/${id}${Url.SEASON_URL}${season}?${Url.API_KEY}`;
    if (images || credits || videos) {
      url += `${Url.APPEND}`;
      const parametres: string[] = [];
      if (images) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      if (credits) {
        parametres.push(`${Url.APPEND_CREDITS}`);
      }
      if (videos) {
        parametres.push(`${Url.APPEND_VIDEOS}`);
      }
      url += parametres.join(',');
    }
    url = UrlBuilder.langUrlBuilder(url, language);
    console.log('seasonUrlBuilder', url);
    return url;
  }

  static detailUrlBuilder(isMovie: boolean, id: number, video: boolean, credit: boolean, reco: boolean, release: boolean, keywords: boolean,
    similar: boolean, image: boolean, titles: boolean, external: boolean, language: string): string {
    let url = isMovie ? Url.MOVIE_URl : Url.SERIE_URl;
    url += `/${id}?${Url.API_KEY}`;
    if (video || credit || reco || image) {
      url += `${Url.APPEND}`;
      const parametres = [];
      if (video) {
        parametres.push(`${Url.APPEND_VIDEOS}`);
      }
      if (credit) {
        parametres.push(`${Url.APPEND_CREDITS}`);
      }
      if (reco) {
        parametres.push(`${Url.APPEND_RECOMMENDATIONS}`);
      }
      if (release) {
        parametres.push(`${Url.APPEND_RELEASE_DATE}`);
      }
      if (keywords) {
        parametres.push(`${Url.APPEND_KEYWORDS}`);
      }
      if (titles) {
        parametres.push(`${Url.APPEND_ALTERNATIVE_TITLES}`);
      }
      if (similar) {
        parametres.push(`${Url.APPEND_SIMILARS}`);
      }
      if (image) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      if (external) {
        parametres.push(`${Url.APPEND_EXTERNAL_IDS}`);
      }
      url += parametres.join(',');
    }
    url = UrlBuilder.langUrlBuilder(url, language);
    console.log('detailUrlBuilder', url);
    return url;
  }

  static playingUrlBuilder(criteria: DiscoverCriteria): string {
    let url = `${Url.PLAYING_URL}`;
    const parametres = [];
    if (criteria.page) {
      parametres.push(`${Url.PAGE_URL}${criteria.page}`);
    }
    if (criteria.region) {
      parametres.push(`${Url.REGION}${criteria.region.toUpperCase()}`);
    }
    url += parametres.join('');
    url = UrlBuilder.langUrlBuilder(url, criteria.language);
    console.log('playingUrlBuilder', url);
    return url;
  }

  static discoverUrlBuilder(criteria: DiscoverCriteria, people: number[], genre: number[], keyword: number[], isMovie: boolean): string {
    let url = `${isMovie ? Url.DISCOVER_MOVIE_URL : Url.DISCOVER_SERIE_URL}`;
    const parametres = [];
    if (criteria.sortField && criteria.sortDir) {
      parametres.push(`${Url.SORT_BY_URL}${criteria.sortField}.${criteria.sortDir}`);
    }
    if (criteria.page) {
      parametres.push(`${Url.PAGE_URL}${criteria.page}`);
    }
    if (criteria.region) {
      parametres.push(`${Url.REGION}${criteria.region.toUpperCase()}`);
    }
    if (criteria.yearMin) {
      parametres.push(`${isMovie ? Url.RELEASE_DATE_GTE_URL : Url.FIRST_AIR_DATE_GTE_URL}${criteria.yearMin}`);
    }
    if (criteria.yearMax) {
      parametres.push(`${isMovie ? Url.RELEASE_DATE_LTE_URL : Url.FIRST_AIR_DATE_LTE_URL}${criteria.yearMax}`);
    }
    if (criteria.adult && isMovie) {
      parametres.push(`${Url.ADULT_URL}`);
    }
    UrlBuilder.voteUrlBuilder(parametres, criteria);
    if (criteria.certification && isMovie) {
      parametres.push(`${Url.CERTIFICATION_COUNTRY_URL}`);
      parametres.push(`${Url.CERTIFICATION_URL}${criteria.certification}`);
    }
    UrlBuilder.runtimeUrlBuilder(parametres, criteria);
    if (criteria.releaseType && isMovie) {
      parametres.push(`${Url.WITH_RELEASE_TYPE_URL}${criteria.releaseType.join(Url.OR_URL)}`);
    }
    if (people && people.length > 0) {
      parametres.push(`${Url.WITH_PEOPLE_URL}${people.join(Url.AND_URL)}`);
    }
    UrlBuilder.genresUrlBuilder(parametres, genre, criteria.genresWithout);
    UrlBuilder.keywordsUrlBuilder(parametres, keyword, criteria.keywordsWithout);
    url += parametres.join('');
    url = UrlBuilder.langUrlBuilder(url, criteria.language);
    console.log('discoverUrlBuilder', url);
    return url;
  }

  private static runtimeUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
    if (criteria.runtimeMin) {
      parametres.push(`${Url.WITH_RUNTIME_GTE_URL}${criteria.runtimeMin}`);
    }
    if (criteria.runtimeMax) {
      parametres.push(`${Url.WITH_RUNTIME_LTE_URL}${criteria.runtimeMax}`);
    }
  }

  private static voteUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
    if (criteria.voteAvergeMin) {
      parametres.push(`${Url.VOTE_AVERAGE_GTE_URL}${criteria.voteAvergeMin}`);
    }
    if (criteria.voteAvergeMax) {
      parametres.push(`${Url.VOTE_AVERAGE_LTE_URL}${criteria.voteAvergeMax}`);
    }
    if (criteria.voteCountMin) {
      parametres.push(`${Url.VOTE_COUNT_GTE_URL}${criteria.voteCountMin}`);
    }
  }

  private static genresUrlBuilder(parametres: string[], genre: number[], genresWithout: boolean): void {
    if (genre && genre.length > 0) {
      const genreUrl = genresWithout ? Url.WITHOUT_GENRES_URL : Url.WITH_GENRES_URL;
      parametres.push(`${genreUrl}${genre.join(Url.OR_URL)}`);
    }
  }

  private static keywordsUrlBuilder(parametres: string[], keyword: number[], keywordsWithout: boolean): void {
    if (keyword && keyword.length > 0) {
      const keywordUrl = keywordsWithout ? Url.WITHOUT_KEYWORDS_URL : Url.WITH_KEYWORDS_URL;
      parametres.push(`${keywordUrl}${keyword.join(Url.OR_URL)}`);
    }
  }

  private static langUrlBuilder(url: string, language: string): string {
    let result = url;
    if (language) {
      result += `${Url.LANGUE}${language}`;
      result += `${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    }
    return result;
  }
}
