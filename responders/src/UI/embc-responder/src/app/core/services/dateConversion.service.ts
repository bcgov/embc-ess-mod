import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {
  constructor(private datePipe: DatePipe) {}

  convertDateTimeToDate(dateTime: string) {
    return new Date(this.datePipe.transform(dateTime, 'dd-MMM-yyyy', 'PST'));
  }

  convertDateTimeToTime(dateTime: string) {
    return this.datePipe.transform(dateTime, 'HH:mm');
  }

  createDateTimeString(date: string, time: string) {
    const dateToDate = new Date(date);
    const hours = +time.split(':', 1).pop();
    const minutes = +time.split(':', 2).pop();

    dateToDate.setTime(dateToDate.getTime() + hours * 60 * 60 * 1000);
    dateToDate.setTime(dateToDate.getTime() + minutes * 60 * 1000);

    return dateToDate.toISOString();
  }
}
