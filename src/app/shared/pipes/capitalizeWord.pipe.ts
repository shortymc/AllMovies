import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'capitalizeWord'})
export class CapitalizeWordPipe implements PipeTransform {
  transform(str: string): string {
    if (!str) {
      return str;
    }
    return str.replace(
      /([^\W_]+[^\s-]*) */g,
      s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
    );
  }
}
