import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';
import { NumberOfNightsPipe } from '../../../../../../shared/pipes/numberOfNights.pipe';
import { MatOption } from '@angular/material/core';

import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-lodging-hotel-motel',
  templateUrl: './lodging-hotel-motel.component.html',
  styleUrls: ['./lodging-hotel-motel.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    NumberOfNightsPipe
  ]
})
export class LodgingHotelMotelComponent implements OnChanges, AfterViewInit {
  @Input() supportDetailsForm: UntypedFormGroup;
  @Input() noOfDays: number;
  referralForm: UntypedFormGroup;
  days: number;
  noOfRooms = globalConst.noOfRooms;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get('referral') as UntypedFormGroup;
    }

    if (changes.noOfDays) {
      this.days = this.noOfDays;
      this.referralForm.get('noOfNights').patchValue(this.noOfDays);
    }
  }

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }
}
