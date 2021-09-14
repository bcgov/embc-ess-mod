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
  selector: 'app-clothing',
  templateUrl: './clothing.component.html',
  styleUrls: ['./clothing.component.scss']
})
export class ClothingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() supportDetailsForm: FormGroup;
  @Input() noOfHouseholdMembers: number;
  referralForm: FormGroup;
  totalAmount = 0;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.referralForm
      .get('extremeWinterConditions')
      .valueChanges.subscribe((value) => {
        this.updateTotalAmount();
      });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get('referral') as FormGroup;
    }
    if (changes.noOfHouseholdMembers) {
      this.updateTotalAmount();
    }
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
    let condition = this.referralForm.get('extremeWinterConditions').value;
    if (condition) {
      this.totalAmount =
        globalConst.extremeConditions.rate * this.noOfHouseholdMembers;
    } else {
      this.totalAmount =
        globalConst.normalConditions.rate * this.noOfHouseholdMembers;
    }

    this.referralForm.get('totalAmount').patchValue(this.totalAmount);
  }
}
