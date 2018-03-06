import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-mini-ts';

@Pipe({ name: 'convertToHHmm' })
export class ConvertToHHmmPipe implements PipeTransform {
  transform(minutes: number): string {
    let result = '';
    result += Math.floor(minutes / 60) + ' heures ';
    result += minutes % 60 + ' minutes';
    return result;
  }
}

@Pipe({ name: 'substractDate' })
export class SubstractDatePipe implements PipeTransform {
  transform(birthday: number, deathday: number): string {
    let age = null;
    if (birthday !== null && birthday !== undefined) {
      const birth = moment(birthday, 'YYYY-MM-DD');
      let tmp = null;
      if (deathday !== null && deathday !== undefined) {
        const death = moment(deathday, 'YYYY-MM-DD');
        tmp = moment.duration({ days: death.date(), months: death.month(), years: death.year() })
          .subtract({ days: birth.date(), months: birth.month(), years: birth.year() });
      } else {
        const now = moment();
        tmp = moment.duration({ days: now.date(), months: now.month(), years: now.year() })
          .subtract({ days: birth.date(), months: birth.month(), years: birth.year() });
      }
      age = tmp.years() + ' ans ' + tmp.months() + ' mois ' + tmp.days() + ' jours';
    }
    return age;
  }
}

@Pipe({ name: 'capitalizeWord' })
export class CapitalizeWordPipe implements PipeTransform {
  transform(str: string): string {
    if (!str) {
      return str;
    }
    str = str.replace(/([^\W_]+[^\s-]*) */g, function(s) {
      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    });
    return str;
  }
}

@Pipe({ name: 'filterCrew' })
export class FilterCrewPipe implements PipeTransform {
  transform(str: any[], args: any): any[] {
    return str.filter(h => h.job.toLowerCase() === args.toLowerCase());
  }
}
