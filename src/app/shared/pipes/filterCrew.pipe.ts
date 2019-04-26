import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterCrew' })
export class FilterCrewPipe implements PipeTransform {
  transform(str: any[], jobs: any[]): any[] {
    if (str) {
      return str.filter(h => jobs.some(job => job.toLowerCase() === h.job.toLowerCase()));
    } else {
      return str;
    }
  }
}
