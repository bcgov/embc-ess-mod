import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { EvacueeSessionService } from '../../../../../../core/services/evacuee-session.service';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-incidentals',
  templateUrl: './incidentals.component.html',
  styleUrls: ['./incidentals.component.scss']
})
export class IncidentalsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() supportDetailsForm: FormGroup;
  @Input() noOfHouseholdMembers: number;
  referralForm: FormGroup;
  totalAmount = 0;
  isPaperBased = false;
  constructor(
    private cd: ChangeDetectorRef,
    public evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.isPaperBased = this.evacueeSessionService?.isPaperBased;
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
    this.totalAmount = globalConst.incidentals.rate * this.noOfHouseholdMembers;
    this.referralForm.get('totalAmount').patchValue(this.totalAmount);
  }

  validateUserTotalAmount() {
    const exceedsTotal =
      !this.isPaperBased &&
      this.referralForm.get('userTotalAmount').value > this.totalAmount;

    if (exceedsTotal) {
      this.referralForm.get('approverName').addValidators(Validators.required);
    } else {
      this.referralForm.get('approverName').setErrors(null);
      this.referralForm.get('approverName').clearValidators();
      this.referralForm.get('approverName').updateValueAndValidity();
    }

    return exceedsTotal;
  }
}
