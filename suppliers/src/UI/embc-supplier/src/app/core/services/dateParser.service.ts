import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateParserService extends NgbDateParserFormatter {
  readonly delimiter = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.delimiter);
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.month + this.delimiter + date.day + this.delimiter + date.year
      : '';
  }
}
