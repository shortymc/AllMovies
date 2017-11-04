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

@Pipe({ name: 'capitalizeWord' })
export class CapitalizeWordPipe implements PipeTransform {
	transform(str: string): string {
		str = str.replace(/([^\W_]+[^\s-]*) */g, function(s) {
			return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
		});
		return str;
	}
}

@Pipe({ name: 'filterCrew' })
export class FilterCrewPipe implements PipeTransform {
	transform(str: any[], args: any): string {
		return str.filter(h => h.job.toLowerCase() == args.toLowerCase()).map(s => s.name).join(', ');
	}
}