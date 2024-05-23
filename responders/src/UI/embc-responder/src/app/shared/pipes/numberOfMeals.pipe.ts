import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mealsArray',
  standalone: true
})
export class NumberOfMealsPipe implements PipeTransform {
  transform(value): Array<number> {
    const numbers = [];
    for (let i = 0; i <= value + 1; i++) {
      numbers.push(i);
    }
    return numbers;
  }
}
