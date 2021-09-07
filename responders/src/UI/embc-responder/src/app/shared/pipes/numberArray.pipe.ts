import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberArray' })
export class NumberArrayPipe implements PipeTransform {
  transform(value): Array<number> {
    const numbers = [];
    for (let i = 1; i <= value + 1; i++) {
      numbers.push(i);
    }
    return numbers;
  }
}
