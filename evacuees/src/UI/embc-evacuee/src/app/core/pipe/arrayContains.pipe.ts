import { Pipe, PipeTransform } from '@angular/core';
import { ProfileDataConflict } from '../api/models';

@Pipe({ name: 'arrayContains' })
export class ArrayContains implements PipeTransform {
    transform(array: Array<ProfileDataConflict>, value: any): boolean {
        if (array) {
            return array.some(element => element.conflictDataElement === value);
        }
    }
}
