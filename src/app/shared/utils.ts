import { Sort } from '@angular/material/sort';

import { GroupBy } from './../model/model';
import { Movie } from './../model/movie';
import { Tag } from './../model/tag';

export class Utils {
  static isBlank(str: string): boolean {
    return str === undefined || str === null || str.trim() === '';
  }

  static getTitle(r: any): string {
    return r.original_title === r.title ? ' ' : r.original_title;
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

  static randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
  static sortMovie(list: Movie[], sort: Sort, lang: string = 'fr'): Movie[] {
    if (sort && sort.active && sort.direction !== '') {
      return list.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'title':
            return Utils.compare(a.translation.get(lang).name, b.translation.get(lang).name, isAsc);
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

  static sortTagMovies(tag: Tag, sort: Sort, lang: string = 'fr'): Tag {
    if (sort && sort.active && sort.direction !== '') {
      tag.movies.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return Utils.compare(+a.id, +b.id, isAsc);
          case 'title':
            return Utils.compare(a.titles.get(lang), b.titles.get(lang), isAsc);
          default:
            return 0;
        }
      });
    }
    return tag;
  }

  static flatMap<T, K>(array: T[], field: string): K[] {
    if (!array || array.length === 0) {
      return [];
    } else if (!Object.keys(array[0]).includes(field)) {
      console.log('array[0]', array[0]);
      throw new Error('Given array doesn\'t have the requested field: ' + field);
    }
    return array.map(obj => obj[field]).reduce((x, y) => x.concat(y), []);
  }

  static unique<T>(array: T[]): T[] {
    const result = [];
    array.forEach(element => {
      if (!result.includes(element)) {
        result.push(element);
      }
    });
    return result;
  }

  static groupBy<T>(items: T[], field: string): GroupBy<T>[] {
    const groupedObj = items.reduce((prev: T, cur: T) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {

      });
    return Object.keys(groupedObj).map(key => new GroupBy(key, <T[]>groupedObj[key]));
  }

  static mapToJson(map: Map<any, any>): string {
    return JSON.stringify(Array.from(map.entries()));
  }

  static jsonToMap(json: string): Map<any, any> {
    return new Map(JSON.parse(json));
  }

}
