import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Injectable()
export class MyNgbDate extends NgbDateParserFormatter {
  constructor(private datePipe: DatePipe) {
    super();
  }

  padNumber(value: number): string {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

  isNumber(value: any): boolean {
    return !isNaN(this.toInteger(value));
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return { year: this.toInteger(dateParts[0]), month: undefined, day: undefined };
      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
        return { year: this.toInteger(dateParts[1]), month: this.toInteger(dateParts[0]), day: undefined };
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        return { year: this.toInteger(dateParts[2]), month: this.toInteger(dateParts[1]), day: this.toInteger(dateParts[0]) };
      }
    }
    return undefined;
  }

  format(date: NgbDateStruct): string {
    let stringDate = '';
    if (date) {
      stringDate += date.year + '-';
      stringDate += this.isNumber(date.month) ? this.padNumber(date.month) + '-' : '';
      stringDate += this.isNumber(date.day) ? this.padNumber(date.day) : '';
    }
    return stringDate;
  }

  dateToString(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  ngbDateToDate(date: NgbDateStruct): Date {
    const dateS = this.format(date);
    return new Date(dateS + 'T00:00:00');
  }

  addDays(date: Date, nbDays: number): Date {
    date.setDate(date.getDate() + nbDays);
    return date;
  }

  getPreviousMonday(date: NgbDateStruct): Date {
    const dateD = this.ngbDateToDate(date);
    dateD.setDate(dateD.getDate() - (dateD.getDay() + 6) % 7);
    return dateD;
  }

  addNgbDays(date: NgbDateStruct, days: number): Date {
    const dateD = this.ngbDateToDate(date);
    dateD.setDate(dateD.getDate() + days);
    return dateD;
  }

  getFollowingSunday(date: NgbDateStruct): Date {
    const dateD = this.ngbDateToDate(date);
    dateD.setDate(dateD.getDate() - (dateD.getDay() + 6) % 7);
    return this.addDays(dateD, 6);
  }

  dateToNgbDateStruct(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
}
