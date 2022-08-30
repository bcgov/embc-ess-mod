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
  selector: 'app-incidentals',
  templateUrl: './incidentals.component.html',
  styleUrls: ['./incidentals.component.scss']
})
export class IncidentalsComponent
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
    this.totalAmount = globalConst.incidentals.rate * this.noOfHouseholdMembers;
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
