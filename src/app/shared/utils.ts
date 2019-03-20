import { Sort } from '@angular/material/sort';
import { Movie } from './../model/movie';
import { Url } from './../constant/url';
import { Tag } from './../model/tag';

export class Utils {

  static readonly ORIGINAL_IMG_SIZE = 0;
  static readonly MEDIUM_IMG_SIZE = 154;
  static readonly SMALL_IMG_SIZE = 92;

  static getPosterPath(r: any, size: number): string {
    return Utils.getPath(r.poster_path, size);
  }

  static getProfilPath(r: any, size: number, noEmpty?: boolean): string {
    return Utils.getPath(r.profile_path, size, noEmpty);
  }

  static isBlank(str: string): boolean {
    return str === undefined || str === null || str.trim() === '';
  }

  static getPath(path: string, size: number, noEmpty?: boolean): string {
    let result: string;
    switch (size) {
      case Utils.ORIGINAL_IMG_SIZE:
        result = (path === undefined || path === null) ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_ORIGINAL + path;
        break;
      case Utils.MEDIUM_IMG_SIZE:
        result = (path === undefined || path === null) ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_MEDIUM + path;
        break;
      case Utils.SMALL_IMG_SIZE:
        result = (path === undefined || path === null) ? Url.IMAGE_URL_EMPTY : Url.IMAGE_URL_SMALL + path;
        break;
    }
    return noEmpty && result === Url.IMAGE_URL_EMPTY ? undefined : result;
  }

  static getTitle(r: any): string {
    return r.original_title === r.title ? ' ' : r.original_title;
  }

  static convertLangToRegion(language: string): string {
    let region: string;
    switch (language) {
      case 'en':
        region = 'US';
        break;
      case 'fr':
        region = 'FR';
        break;
      case 'es':
        region = 'ES';
        break;
      case 'it':
        region = 'IT';
        break;
      case 'de':
        region = 'DE';
        break;
      default:
        region = 'US';
        break;
    }
    return region;
  }

  static convertTimeStringToNumber(time: string): number {
    if (time) {
      let h = parseInt(time.substr(0, time.indexOf('h')).trim(), 10);
      if (isNaN(h)) {
        h = 0;
      }
      const m = parseInt(time.substring(time.lastIndexOf('h') + 1, time.lastIndexOf('min')).trim(), 10);
      return h * 60 + m;
    } else {
      return 0;
    }
  }

  static convertTimeNumberToString(minutes: number): string {
    if (minutes) {
      const min = Math.round(minutes);
      let result = '';
      result += Math.floor(min / 60);
      result += ' h ';
      result += min % 60;
      result += ' min ';
      return result;
    } else {
      return '0 min';
    }
  }

  static jobEquals(job: string, filter: string): boolean {
    return job.toLowerCase() === filter.toLowerCase();
  }

  static sortCast(a1: any, a2: any): any {
    if (a1.cast_id < a2.cast_id) {
      return -1;
    } else if (a1.cast_id > a2.cast_id) {
      return 1;
    } else {
      return 0;
    }
  }

  static compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  static compareDate(a: string, b: string, isAsc: boolean): number {
    const year1: string = a.split('/')[0];
    const month1: string = a.split('/')[1];
    const year2: string = b.split('/')[0];
    const month2: string = b.split('/')[1];
    let result: number;
    if (year1 < year2) {
      result = -1;
    } else if (year1 > year2) {
      result = 1;
    } else {
      if (month1 < month2) {
        result = -1;
      } else if (month1 > month2) {
        result = 1;
      }
    }
    return result * (isAsc ? 1 : -1);
  }

  static compareMetaScore(a: Movie, b: Movie, isAsc: boolean): number {
    let c = a.score.ratings ? a.score.ratings.find(rating => rating.Source === 'Metacritic') : undefined;
    let d = b.score.ratings ? b.score.ratings.find(rating => rating.Source === 'Metacritic') : undefined;
    c = c ? c.Value : '';
    d = d ? d.Value : '';
    let meta1 = 0;
    let meta2 = 0;
    if (c.length > 0) {
      meta1 = parseInt(c.substr(0, c.indexOf('/')), 10);
    }
    if (d.length > 0) {
      meta2 = parseInt(d.substr(0, d.indexOf('/')), 10);
    }
    return Utils.compare(meta1, meta2, isAsc);
  }

  static compareObject(a: any, b: any): number {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }

  static parseJson(json: string): any {
    if (!json || json === undefined || json === '' || json === 'undefined') {
      return json;
    } else {
      return JSON.parse(json);
    }
  }

  static stringifyJson(value: any): string {
    if (!value || value === undefined || value === '' || value === 'undefined') {
      return '';
    } else {
      return JSON.stringify(value);
    }
  }

  static filter<T>(list: T[], searchString: string): T[] {
    if (!list || list === undefined || list.length === 0) {
      return [];
    }
    if (searchString === undefined || searchString.length === 0 || searchString.trim() === '') {
      return list;
    }

    return list.filter(Utils.compareWithAllFields, searchString);
  }

  static filterByFields<T>(items: T[], fields: string[], value: any): T[] {
    if (!items || items === undefined) {
      return [];
    }
    if (value === undefined || value.length === 0) {
      return items;
    }
    const val = value.toLowerCase();
    return items.filter(item => {
      return fields.some(field => {
        let it = item[field];
        if (it) {
          it = typeof it === 'string' ? it.toLowerCase() : it.toString();
          return it.includes(val);
        }
      });
    });
  }

  static compareWithAllFields(value: any, index: number): boolean {
    const fields: string[] = Object.keys(value);
    for (let i = 0; i < fields.length; i++) {
      if (value[fields[i]] !== undefined) {
        if (true) {  // isObject(value[fields[i]])
          const childFields: string[] = Object.keys(value[fields[i]]);

          if (childFields.length > 0) {
            for (let j = 0; j < childFields.length; j++) {
              if ((value[fields[i]][childFields[j]] + '').toLowerCase().indexOf(this.toString().toLowerCase()) !== -1) {
                return true;
              }
            }
          }
        }
        if ((value[fields[i]] + '').toLowerCase().indexOf(this.toString().toLowerCase()) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  /* tslint:disable cyclomatic-complexity */
  static sortMovie(list: Movie[], sort: Sort): Movie[] {
    if (sort && sort.active && sort.direction !== '') {
      return list.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'title':
            return Utils.compare(a.title, b.title, isAsc);
          case 'original_title':
            return Utils.compare(a.original_title, b.original_title, isAsc);
          case 'note':
            return Utils.compare(+a.note, +b.note, isAsc);
          case 'vote_count':
            return Utils.compare(+a.vote_count, +b.vote_count, isAsc);
          case 'popularity':
            return Utils.compare(+a.popularity, +b.popularity, isAsc);
          case 'meta':
            return this.compareMetaScore(a, b, isAsc);
          case 'language':
            return Utils.compare(a.language, b.language, isAsc);
          case 'added':
            return Utils.compare(new Date(a.added), new Date(b.added), isAsc);
          case 'date':
            return Utils.compareDate(a.date, b.date, isAsc);
          case 'time':
            return Utils.compare(+a.time, +b.time, isAsc);
          default:
            return 0;
        }
      });
    } else {
      return list;
    }
  }

  static sortTags(list: Tag[], sort: Sort): Tag[] {
    if (sort && sort.active && sort.direction !== '') {
      return list.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'label':
            return Utils.compare(a.label, b.label, isAsc);
          case 'count':
            return Utils.compare(a.movies.length, b.movies.length, isAsc);
          default:
            return 0;
        }
      });
    } else {
      return list;
    }
  }

  static sortTagMovies(tag: Tag, sort: Sort): Tag {
    if (sort && sort.active && sort.direction !== '') {
      tag.movies.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'title':
            return Utils.compare(a.title, b.title, isAsc);
          default:
            return 0;
        }
      });
    }
    return tag;
  }
}
