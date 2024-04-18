import { Pipe, PipeTransform } from '@angular/core';
import { ProfileDataConflict } from '../api/models';

@Pipe({
  name: 'arrayValueOf',
  standalone: true
})
export class ArrayValueOf implements PipeTransform {
  transform(array: Array<ProfileDataConflict>, value: string): ProfileDataConflict {
    if (array) {
      return array.find((element) => element.dataElementName === value);
    }
  }
}
