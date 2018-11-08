import { DiscoverCriteria } from './../model/discover-criteria';
import { Url } from './../constant/url';

export class UrlBuilder {

  static personUrlBuilder(id: number, language: string, images: boolean, movies: boolean): string {
    let url = `${Url.PERSON_URL}/${id}?${Url.API_KEY}`;
    if (images || movies) {
      url += `${Url.APPEND}`;
      const parametres: string[] = [];
      if (images) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      if (movies) {
        parametres.push(`${Url.APPEND_CREDITS}`);
      }
      url += parametres.join(',');
    }
    url = UrlBuilder.langUrlBuilder(url, language);
    console.log('personUrlBuilder', url);
    return url;
  }

  static movieUrlBuilder(id: number, video: boolean, credit: boolean, reco: boolean, keywords: boolean,
    similar: boolean, image: boolean, language: string): string {
    let url = `${Url.MOVIE_URl}/${id}?${Url.API_KEY}`;
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
      if (keywords) {
        parametres.push(`${Url.APPEND_KEYWORDS}`);
      }
      if (similar) {
        parametres.push(`${Url.APPEND_SIMILARS}`);
      }
      if (image) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      url += parametres.join(',');
    }
    url = UrlBuilder.langUrlBuilder(url, language);
    console.log('movieUrlBuilder', url);
    return url;
  }

  static discoverUrlBuilder(criteria: DiscoverCriteria): string {
    let url = `${Url.DISCOVER_URL}`;
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
      parametres.push(`${Url.RELEASE_DATE_GTE_URL}${criteria.yearMin}`);
    }
    if (criteria.yearMax) {
      parametres.push(`${Url.RELEASE_DATE_LTE_URL}${criteria.yearMax}`);
    }
    if (criteria.adult) {
      parametres.push(`${Url.ADULT_URL}`);
    }
    UrlBuilder.voteUrlBuilder(parametres, criteria);
    if (criteria.certification) {
      parametres.push(`${Url.CERTIFICATION_COUNTRY_URL}`);
      parametres.push(`${Url.CERTIFICATION_URL}${criteria.certification}`);
    }
    UrlBuilder.runtimeUrlBuilder(parametres, criteria);
    if (criteria.releaseType) {
      parametres.push(`${Url.WITH_RELEASE_TYPE_URL}${criteria.releaseType.join(Url.OR_URL)}`);
    }
    if (criteria.personsIds) {
      parametres.push(`${Url.WITH_PEOPLE_URL}${criteria.personsIds.join(Url.AND_URL)}`);
    }
    UrlBuilder.genresUrlBuilder(parametres, criteria);
    UrlBuilder.keywordsUrlBuilder(parametres, criteria);
    url += parametres.join('');
    url = UrlBuilder.langUrlBuilder(url, criteria.language);
    console.log('discoverUrlBuilder', url);
    return url;
  }

  static runtimeUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
    if (criteria.runtimeMin) {
      parametres.push(`${Url.WITH_RUNTIME_GTE_URL}${criteria.runtimeMin}`);
    }
    if (criteria.runtimeMax) {
      parametres.push(`${Url.WITH_RUNTIME_LTE_URL}${criteria.runtimeMax}`);
    }
  }

  static voteUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
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

  static genresUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
    if (criteria.genresId && !criteria.genresWithout) {
      parametres.push(`${Url.WITH_GENRES_URL}${criteria.genresId.join(Url.AND_URL)}`);
    }
    if (criteria.genresId && criteria.genresWithout) {
      parametres.push(`${Url.WITHOUT_GENRES_URL}${criteria.genresId.join(Url.AND_URL)}`);
    }
  }

  static keywordsUrlBuilder(parametres: string[], criteria: DiscoverCriteria): void {
    if (criteria.keywordsIds && !criteria.keywordsWithout) {
      parametres.push(`${Url.WITH_KEYWORDS_URL}${criteria.keywordsIds.join(Url.AND_URL)}`);
    }
    if (criteria.keywordsIds && criteria.keywordsWithout) {
      parametres.push(`${Url.WITHOUT_KEYWORDS_URL}${criteria.keywordsIds.join(Url.OR_URL)}`);
    }
  }

  static langUrlBuilder(url: string, language: string): string {
    let result = url;
    if (language) {
      result += `${Url.LANGUE}${language}`;
      result += `${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    }
    return result;
  }
}
