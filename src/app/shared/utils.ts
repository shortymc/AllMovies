import { Sort } from '@angular/material/sort';

import { GroupBy } from './../model/model';
import { Tag } from './../model/tag';
import { Data } from '../model/data';

export class Utils {

  static timeSliderFormatter = {
    to(minutes: any): any {
      return Utils.convertTimeNumberToString(minutes);
    },
    from(time: any): any {
      const res = Utils.convertTimeStringToNumber(time);
      if (isNaN(res)) {
        return time;
      }
      return res;
    }
  };

  static isBlank(str: string): boolean {
    return str === undefined || str === null || str.trim() === '';
  }

  static getTitle(r: any, isMovie: boolean = true): string {
    const field = isMovie ? 'title' : 'name';
    return r['original_' + field] === r[field] ? ' ' : r['original_' + field];
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

  static jobContains(job: string, jobList: string[]): boolean {
    return jobList.some(j => j.toLowerCase() === job.toLowerCase());
  }

  static sortCast(a1: any, a2: any): any {
    if (a1.order < a2.order) {
      return -1;
    } else if (a1.order > a2.order) {
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

  static compareMetaScore<T extends Data>(a: T, b: T, isAsc: boolean): number {
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
  static sortData<T extends Data>(list: T[], sort: Sort, lang: string = 'fr'): T[] {
    if (sort && sort.active && sort.direction !== '') {
      return list.sort((a, b) => {
        const isAsc: boolean = sort.direction === 'asc';
        const field = sort.active;
        if (['original_title', 'language', 'title', 'inProduction', 'originLang'].includes(field)) {
          return Utils.compare(a[field], b[field], isAsc);
        } else if (['date', 'firstAired'].includes(sort.active)) {
          return Utils.compareDate(a[field], b[field], isAsc);
        } else if (['added'].includes(sort.active)) {
          return Utils.compare(new Date(a[field]), new Date(b[field]), isAsc);
        } else if (['meta'].includes(sort.active)) {
          return this.compareMetaScore(a, b, isAsc);
        } else if (['id', 'vote', 'vote_count', 'popularity', 'time', 'seasonCount'].includes(sort.active)) {
          return Utils.compare(+a[field], +b[field], isAsc);
        } else if (['runtimes'].includes(sort.active)) {
          return Utils.compare(+a[field][0], +b[field][0], isAsc);
        } else if (['name'].includes(sort.active)) {
          return Utils.compare(a.translation.get(lang).name, b.translation.get(lang).name, isAsc);
        } else {
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
            return Utils.compare(a.datas.length, b.datas.length, isAsc);
          default:
            return 0;
        }
      });
    } else {
      return list;
    }
  }

  static sortTagDatas(tag: Tag, sort: Sort, lang: string = 'fr'): Tag {
    if (sort && sort.active && sort.direction !== '') {
      tag.datas.sort((a, b) => {
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
