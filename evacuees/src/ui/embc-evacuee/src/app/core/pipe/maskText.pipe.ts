import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maskText' })
export class MaskTextPipe implements PipeTransform {
  transform(value): object {
    if (value !== null && value !== undefined) {
      return value.replace(/./g, '*');
    }
  }
}
