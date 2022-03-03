import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'convertToHHmm'})
export class ConvertToHHmmPipe implements PipeTransform {
  transform(minutes: number, args: boolean): string {
    let result = '';
    const div = Math.floor(minutes / 60);
    if (div !== 0) {
      result += div;
      if (args) {
        result += 'h ';
      } else {
        result += ' heures ';
      }
    }
    const mod = minutes % 60;
    if (mod !== 0) {
      result += mod;
      if (args) {
        result += 'min ';
      } else {
        result += ' minutes ';
      }
    }
    return result;
  }
}
