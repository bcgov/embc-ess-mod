import { Pipe, PipeTransform } from '@angular/core';

const pad2 = (n: number): string => (n < 10 ? '0' + n : n.toString());

@Pipe({ name: 'flatDateFormat' })
export class FlatDateFormatPipe implements PipeTransform {
  transform(date: Date): string {
    return `${date.getFullYear().toString()}${pad2(date.getMonth() + 1)}${pad2(
      date.getDate()
    )}${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(
      date.getSeconds()
    )}`;
  }
}
