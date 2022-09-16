import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-food-meals',
  templateUrl: './food-meals.component.html',
  styleUrls: ['./food-meals.component.scss']
})
export class FoodMealsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() supportDetailsForm: UntypedFormGroup;
  @Input() noOfDays: number;
  @Input() noOfHouseholdMembers: number;
  referralForm: UntypedFormGroup;
  days: number;
  totalAmount = 0;

  constructor(
    private cd: ChangeDetectorRef,
    public appBaseService: AppBaseService
  ) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get(
        'referral'
      ) as UntypedFormGroup;
    }
    if (changes.noOfDays) {
      this.days = this.noOfDays;
      this.referralForm.get('noOfBreakfast').patchValue(this.noOfDays);
      this.referralForm.get('noOfLunches').patchValue(this.noOfDays);
      this.referralForm.get('noOfDinners').patchValue(this.noOfDays);
    }
    if (changes.noOfHouseholdMembers) {
      this.updateTotalAmount();
    }
  }

  ngOnInit(): void {
    this.referralForm.get('noOfBreakfast').valueChanges.subscribe((value) => {
      this.updateTotalAmount();
    });

    this.referralForm.get('noOfLunches').valueChanges.subscribe((value) => {
      this.updateTotalAmount();
    });

    this.referralForm.get('noOfDinners').valueChanges.subscribe((value) => {
      this.updateTotalAmount();
    });
  }

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }

  /**
   * Calculates the total restaurant meals amount
   */
  updateTotalAmount() {
    const breakfastAmount =
      globalConst.mealRate.breakfast *
      this.referralForm.get('noOfBreakfast').value *
      this.noOfHouseholdMembers;
    const lunchAmount =
      globalConst.mealRate.lunch *
      this.referralForm.get('noOfLunches').value *
      this.noOfHouseholdMembers;
    const dinnerAmount =
      globalConst.mealRate.dinner *
      this.referralForm.get('noOfDinners').value *
      this.noOfHouseholdMembers;
    this.totalAmount = breakfastAmount + lunchAmount + dinnerAmount;
    this.referralForm.get('totalAmount').patchValue(this.totalAmount);
    this.checkOverlimit(this.totalAmount);
  }

  checkOverlimit(totalAmount: number) {
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
