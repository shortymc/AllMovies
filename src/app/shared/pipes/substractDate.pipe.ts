import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-mini-ts';

@Pipe({ name: 'substractDate' })
export class SubstractDatePipe implements PipeTransform {
  transform(birthday: number, deathday: number): string {
    let age;
    if (birthday !== undefined) {
      const birth = moment(birthday, 'YYYY-MM-DD');
      let tmp;
      if (deathday !== undefined) {
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
