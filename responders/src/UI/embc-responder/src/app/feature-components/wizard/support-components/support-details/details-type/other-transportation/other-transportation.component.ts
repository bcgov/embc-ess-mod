import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';
import { NumberCommaDirective } from '../../../../../../shared/directives/number-comma.directive';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError, MatPrefix } from '@angular/material/form-field';

@Component({
  selector: 'app-other-transportation',
  templateUrl: './other-transportation.component.html',
  styleUrls: ['./other-transportation.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NumberCommaDirective,
    MatPrefix
  ]
})
export class OtherTransportationComponent implements OnChanges, AfterViewInit {
  @Input() supportDetailsForm: UntypedFormGroup;
  referralForm: UntypedFormGroup;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get('referral') as UntypedFormGroup;
    }
  }

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }
}
