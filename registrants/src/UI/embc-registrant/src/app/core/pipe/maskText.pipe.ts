import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskText',
  standalone: true
})
export class MaskTextPipe implements PipeTransform {
  transform(value): string {
    if (value !== null && value !== undefined) {
      return value.replace(/./g, '*');
    }
  }
}
