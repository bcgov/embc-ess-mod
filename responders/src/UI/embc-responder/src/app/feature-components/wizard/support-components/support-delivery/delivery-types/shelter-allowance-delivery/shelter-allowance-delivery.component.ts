import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import * as globalConst from '../../../../../../core/services/global-constants';
import { IMaskDirective } from 'angular-imask';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-shelter-allowance-delivery',
  templateUrl: './shelter-allowance-delivery.component.html',
  styleUrls: ['./shelter-allowance-delivery.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, IMaskDirective]
})
export class ShelterAllowanceDeliveryComponent implements OnInit, OnChanges {
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
      this.detailsForm = this.supportDeliveryForm.get('details') as UntypedFormGroup;
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.detailsForm.controls;
  }
}
