import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {
  constructor(private datePipe: DatePipe) {}

  convertDateTimeToDate(dateTime: string) {
    return new Date(this.datePipe.transform(dateTime, 'MMM d, y', 'PST'));
  }

  convertDateTimeToTime(dateTime: string) {
    return this.datePipe.transform(dateTime, 'HH:mm');
  }

  createDateTimeString(date: string, time: string) {
    if (time && date) {
      const dateToDate = new Date(date);
      const hours = +time.split(':', 1).pop();
      const minutes = +time.split(':', 2).pop();

      dateToDate.setTime(dateToDate.getTime() + hours * 60 * 60 * 1000);
      dateToDate.setTime(dateToDate.getTime() + minutes * 60 * 1000);

      return dateToDate.toISOString();
    }
  }

  /**
   * Converts Date object into a valid date format for datepickers
   *
   * @param date the date object
   * @returns a valid date format for datepicker
   */
  convertStringToDate(date: any): Date {
    if (typeof date === 'object') {
      date = this.datePipe.transform(date, 'dd-MMM-yyyy');
    }

    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11
    };
    const p = date.split('-');
    return new Date(p[2], months[p[1].toLowerCase()], p[0]);
  }

  getNoOfDays(to: string, from: string) {
    const milliseconds = moment(this.datePipe.transform(to, 'yyyy-MM-dd')).diff(
      this.datePipe.transform(from, 'yyy-MM-dd')
    );

    return milliseconds / 86400000;
  }

  convertDateTimeToDateUTC(date: string) {
    return this.datePipe.transform(date, 'dd-MMM-yyyy', 'utc');
  }
}
