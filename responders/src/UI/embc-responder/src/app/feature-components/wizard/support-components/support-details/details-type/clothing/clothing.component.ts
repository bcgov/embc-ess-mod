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
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
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
  @Input() supportDetailsForm: UntypedFormGroup;
  @Input() noOfHouseholdMembers: number;
  referralForm: UntypedFormGroup;
  totalAmount = 0;
  isPaperBased = false;
  userTotalAmountSubscription: Subscription;
  constructor(
    private cd: ChangeDetectorRef,
    public evacueeSessionService: EvacueeSessionService,
    public appBaseService: AppBaseService
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
      this.referralForm = this.supportDetailsForm.get(
        'referral'
      ) as UntypedFormGroup;
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

  checkOverlimit($event) {
    const amount = Number($event.target.value.toString().replace(/,/g, ''));
    const exceedsLimit = amount > globalConst.etransferLimt;

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
