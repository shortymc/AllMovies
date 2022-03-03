import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: number): any {
    if (!value || value === '' || value.length < args) {
      return value;
    } else {
      return value
        .slice(0, args - 1)
        .trim()
        .concat('...');
    }
  }
}
