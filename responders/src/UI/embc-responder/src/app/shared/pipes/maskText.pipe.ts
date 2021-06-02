import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maskText' })
export class MaskTextPipe implements PipeTransform {
  transform(value): string {
    if (value !== null && value !== undefined) {
      return value.replace(/./g, '*');
    }
  }
}
