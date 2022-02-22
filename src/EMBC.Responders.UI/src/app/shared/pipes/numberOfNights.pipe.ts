import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nightsArray' })
export class NumberOfNightsPipe implements PipeTransform {
  transform(value): Array<number> {
    const numbers = [];
    for (let i = 1; i <= value; i++) {
      numbers.push(i);
    }
    return numbers;
  }
}
