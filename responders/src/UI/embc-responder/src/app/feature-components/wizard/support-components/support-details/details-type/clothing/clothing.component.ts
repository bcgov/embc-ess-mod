import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EvacueeSessionService } from '../../../../../../core/services/evacuee-session.service';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-clothing',
  templateUrl: './clothing.component.html',
  styleUrls: ['./clothing.component.scss']
})
export class ClothingComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() supportDetailsForm: FormGroup;
  @Input() noOfHouseholdMembers: number;
  referralForm: FormGroup;
  totalAmount = 0;
  isPaperBased = false;
  userTotalAmountSubscription: Subscription;
  constructor(
    private cd: ChangeDetectorRef,
    public evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.referralForm
      .get('extremeWinterConditions')
      .valueChanges.subscribe((value) => {
        this.updateTotalAmount();
      });
    this.isPaperBased = this.evacueeSessionService?.isPaperBased;

    this.userTotalAmountSubscription = this.referralForm
      .get('userTotalAmount')
      .valueChanges.subscribe((value) => {
        this.referralForm.get('approverName').updateValueAndValidity();
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

  ngOnDestroy(): void {
    this.userTotalAmountSubscription.unsubscribe();
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
    const condition = this.referralForm.get('extremeWinterConditions').value;
    if (condition) {
      this.totalAmount =
        globalConst.extremeConditions.rate * this.noOfHouseholdMembers;
    } else {
      this.totalAmount =
        globalConst.normalConditions.rate * this.noOfHouseholdMembers;
    }

    this.referralForm.get('totalAmount').patchValue(this.totalAmount);
  }

  validateUserTotalAmount() {
    const exceedsTotal =
      !this.isPaperBased &&
      Number(
        this.referralForm
          .get('userTotalAmount')
          .value.toString()
          .replace(/,/g, '')
      ) > this.totalAmount;

    if (!exceedsTotal && this.referralForm.get('approverName').value) {
      this.referralForm.get('approverName').patchValue('');
    }

    return exceedsTotal;
  }
}
