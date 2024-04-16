import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-shelter-allowance',
  templateUrl: './shelter-allowance.component.html',
  styleUrls: ['./shelter-allowance.component.scss']
})
export class ShelterAllowanceGroupComponent implements OnInit, OnChanges, AfterViewInit {
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
    if (changes.selectedHouseholdMembers) {
      this.updateTotalAmount();
    }

    this.referralForm.get('noOfNights').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }
  updateTotalAmount() {
    this.members = this.supportDetailsForm.get('members').value;
    this.nofNight = this.referralForm.get('noOfNights').value;

    this.totalAmount = 0;
    if (this.members != null && this.members.length === 1) {
      this.totalAmount = this.nofNight * globalConst.shelterAllowanceRate.rate;
    } else if (this.members != null && this.members.length > 1) {
      const count = this.members.reduce(
        (acc, member) => {
          if (member.isMinor) {
            acc.minorCount++;
          } else {
            acc.adultCount++;
          }
          return acc;
        },
        { minorCount: 0, adultCount: 0 }
      );

      if (count.adultCount === 0) {
        this.totalAmount =
          this.nofNight * (globalConst.shelterAllowanceRate.rate + (count.minorCount - 1) * globalConst.shelterAllowanceRate.child);
      } else {
        this.totalAmount =
          this.nofNight *
          (globalConst.shelterAllowanceRate.rate +
            count.minorCount * globalConst.shelterAllowanceRate.child +
            (count.adultCount - 1) * globalConst.shelterAllowanceRate.adult);
      }
      if (this.totalAmount < 0) this.totalAmount = 0;
    }
    this.referralForm.get('totalAmount').patchValue(this.totalAmount);

    this.checkOverlimit(this.totalAmount);
  }
  ngOnInit(): void {}

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
