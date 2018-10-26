import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterCrew' })
export class FilterCrewPipe implements PipeTransform {
  transform(str: any[], args: any): any[] {
    if (str) {
      return str.filter(h => h.job.toLowerCase() === args.toLowerCase());
    } else {
      return str;
    }
  }
}
