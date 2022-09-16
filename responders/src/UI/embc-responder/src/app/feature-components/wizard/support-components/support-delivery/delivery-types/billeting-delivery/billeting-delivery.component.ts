import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-billeting-delivery',
  templateUrl: './billeting-delivery.component.html',
  styleUrls: ['./billeting-delivery.component.scss']
})
export class BilletingDeliveryComponent implements OnInit, OnChanges {
  @Input() supportDeliveryForm: UntypedFormGroup;
  detailsForm: UntypedFormGroup;

  readonly phoneMask = globalConst.phoneMask;

  constructor() {}

  ngOnInit(): void {
    this.detailsForm
      .get('hostPhone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.detailsForm.get('emailAddress').updateValueAndValidity();
      });

    this.detailsForm
      .get('emailAddress')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.detailsForm.get('hostPhone').updateValueAndValidity();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDeliveryForm) {
      this.detailsForm = this.supportDeliveryForm.get(
        'details'
      ) as UntypedFormGroup;
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.detailsForm.controls;
  }
}
