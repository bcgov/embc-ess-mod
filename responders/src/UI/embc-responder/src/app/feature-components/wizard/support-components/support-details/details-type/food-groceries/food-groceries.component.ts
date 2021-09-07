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
  selector: 'app-food-groceries',
  templateUrl: './food-groceries.component.html',
  styleUrls: ['./food-groceries.component.scss']
})
export class FoodGroceriesComponent
  implements OnInit, OnChanges, AfterViewInit {
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
      this.referralForm.get('noOfMeals').patchValue(this.noOfDays + 1);
    }
    if (changes.noOfHouseholdMembers) {
      this.updateTotalAmount();
    }
  }

  ngOnInit(): void {
    this.referralForm.get('noOfMeals').valueChanges.subscribe((value) => {
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
    this.totalAmount =
      globalConst.groceriesRate.rate *
      this.referralForm.get('noOfMeals').value *
      this.noOfHouseholdMembers;
    this.referralForm.get('totalAmount').patchValue(this.totalAmount);
  }
}
