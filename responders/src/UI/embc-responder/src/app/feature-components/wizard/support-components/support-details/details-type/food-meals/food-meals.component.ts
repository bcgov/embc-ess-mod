import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-food-meals',
  templateUrl: './food-meals.component.html',
  styleUrls: ['./food-meals.component.scss']
})
export class FoodMealsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() supportDetailsForm: FormGroup;
  @Input() noOfDays: number;
  @Input() noOfHouseholdMembers: number;
  referralForm: FormGroup;
  days: number;
  totalAmount = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get('referral') as FormGroup;
    }
    if (changes.noOfDays) {
      this.days = this.noOfDays;
      this.referralForm.get('noOfBreakfast').patchValue(this.noOfDays + 1);
      this.referralForm.get('noOfLunches').patchValue(this.noOfDays + 1);
      this.referralForm.get('noOfDinners').patchValue(this.noOfDays + 1);
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
  }
}
