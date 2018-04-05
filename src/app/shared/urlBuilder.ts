import { Url } from './../constant/url';

export class UrlBuilder {

  static movieUrlBuilder(id: number, video: boolean, credit: boolean, reco: boolean, image: boolean, language: string): string {
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
      if (image) {
        parametres.push(`${Url.APPEND_IMAGES}`);
      }
      url += parametres.join(',');
    }
    if (language) {
      url += `${Url.LANGUE}${language}`;
      url += `${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    }
    console.log('movieUrlBuilder', url);
    return url;
  }

  static discoverUrlBuilder(language: string, sortField: string, sortDir: string, page: number, yearMin?: number,
    yearMax?: number, adult?: boolean, voteAvergeMin?: number, voteAvergeMax?: number,
    voteCountMin?: number, certification?: string[], runtimeMin?: number, runtimeMax?: number,
    releaseType?: number[], personsIds?: number[], genresId?: number[], genresWithout?: boolean,
    keywordsIds?: number[], keywordsWithout?: boolean): string {
    let url = `${Url.DISCOVER_URL}`;
    const parametres = [];
    if (sortField && sortDir) {
      parametres.push(`${Url.SORT_BY_URL}${sortField}.${sortDir}`);
    }
    if (page) {
      parametres.push(`${Url.PAGE_URL}${page}`);
    }
    if (yearMin) {
      parametres.push(`${Url.RELEASE_DATE_GTE_URL}${yearMin}`);
    }
    if (yearMax) {
      parametres.push(`${Url.RELEASE_DATE_LTE_URL}${yearMax}`);
    }
    if (adult) {
      parametres.push(`${Url.ADULT_URL}`);
    }
    if (voteAvergeMin) {
      parametres.push(`${Url.VOTE_AVERAGE_GTE_URL}${voteAvergeMin}`);
    }
    if (voteAvergeMax) {
      parametres.push(`${Url.VOTE_AVERAGE_LTE_URL}${voteAvergeMax}`);
    }
    if (voteCountMin) {
      parametres.push(`${Url.VOTE_COUNT_GTE_URL}${voteCountMin}`);
    }
    if (certification) {
      parametres.push(`${Url.CERTIFICATION_COUNTRY_URL}`);
      parametres.push(`${Url.CERTIFICATION_URL}${certification.join(Url.OR_URL)}`);
    }
    if (runtimeMin) {
      parametres.push(`${Url.WITH_RUNTIME_GTE_URL}${runtimeMin}`);
    }
    if (runtimeMax) {
      parametres.push(`${Url.WITH_RUNTIME_LTE_URL}${runtimeMax}`);
    }
    if (releaseType) {
      parametres.push(`${Url.WITH_RELEASE_TYPE_URL}${releaseType.join(Url.OR_URL)}`);
    }
    if (personsIds) {
      parametres.push(`${Url.WITH_PEOPLE_URL}${personsIds.join(Url.OR_URL)}`);
    }
    if (genresId && !genresWithout) {
      parametres.push(`${Url.WITH_GENRES_URL}${genresId.join(Url.OR_URL)}`);
    }
    if (genresId && genresWithout) {
      parametres.push(`${Url.WITHOUT_GENRES_URL}${genresId.join(Url.OR_URL)}`);
    }
    if (keywordsIds && !keywordsWithout) {
      parametres.push(`${Url.WITH_KEYWORDS_URL}${keywordsIds.join(Url.OR_URL)}`);
    }
    if (keywordsIds && keywordsWithout) {
      parametres.push(`${Url.WITHOUT_KEYWORDS_URL}${keywordsIds.join(Url.OR_URL)}`);
    }
    url += parametres.join('');
    if (language) {
      url += `${Url.LANGUE}${language}`;
      url += `${Url.INCLUDE_IMAGE_LANGUAGE}${language},null`;
    }
    console.log('discoverUrlBuilder', url);
    return url;
  }
}
