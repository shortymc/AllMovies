import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertToHHmm' })
export class ConvertToHHmmPipe implements PipeTransform {
    transform(minutes: number): string {
        let result = "";
        result += Math.floor(minutes / 60) + " heures ";
        result += minutes % 60 + " minutes";
        return result;
    }
}