import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { NumberOfNightsPipe } from '../../../../../../shared/pipes/numberOfNights.pipe';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-shelter-allowance',
  templateUrl: './shelter-allowance.component.html',
  styleUrls: ['./shelter-allowance.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatCheckbox,
    DecimalPipe,
    NumberOfNightsPipe
  ]
})
export class ShelterAllowanceGroupComponent implements OnChanges, AfterViewInit {
  @Input() supportDetailsForm: UntypedFormGroup;
  @Input() noOfDays: number;
  referralForm: UntypedFormGroup;
  days: number;
  totalAmount = 0;
  constructor(
    private cd: ChangeDetectorRef,
    private appBaseService: AppBaseService
  ) {}
  @Input() selectedHouseholdMembers: any[];
  nofNight = 0;
  members: any[];

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
      this.updateTotalAmount();
    }

    this.referralForm.get('noOfNights').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }
  updateTotalAmount() {
    this.nofNight = this.referralForm.get('noOfNights').value;
    this.totalAmount = this.nofNight * globalConst.shelterAllowanceRate.rate;

    if (this.totalAmount < 0) this.totalAmount = 0;

    this.referralForm.get('totalAmount').patchValue(this.totalAmount);

    this.checkOverlimit(this.totalAmount);
  }

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }

  checkOverlimit(totalAmount) {
    const exceedsLimit = totalAmount > globalConst.etransferLimt;

    if (exceedsLimit) {
      this.appBaseService.etransferProperties = {
        isTotalAmountOverlimit: true
      };
    } else {
      this.appBaseService.etransferProperties = {
        isTotalAmountOverlimit: false
      };
    }
  }
}
