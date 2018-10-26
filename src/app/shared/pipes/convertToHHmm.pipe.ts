import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertToHHmm' })
export class ConvertToHHmmPipe implements PipeTransform {
  transform(minutes: number, args: boolean): string {
    let result = '';
    result += Math.floor(minutes / 60);
    if (args) {
      result += 'h ';
    } else {
      result += ' heures ';
    }
    result += minutes % 60;
    if (args) {
      result += 'min ';
    } else {
      result += ' minutes ';
    }
    return result;
  }
}
