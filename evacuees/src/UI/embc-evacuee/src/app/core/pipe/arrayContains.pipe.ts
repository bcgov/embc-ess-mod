import { Pipe, PipeTransform } from '@angular/core';
import { ProfileDataConflict } from '../api/models';

@Pipe({ name: 'arrayContains' })
export class ArrayContains implements PipeTransform {
  transform(array: Array<ProfileDataConflict>, value: string): boolean {
    if (array) {
      return array.some((element) => element.dataElementName === value);
    }
  }
}
