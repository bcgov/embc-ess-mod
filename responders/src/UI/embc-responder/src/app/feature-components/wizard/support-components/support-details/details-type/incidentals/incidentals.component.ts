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
  selector: 'app-incidentals',
  templateUrl: './incidentals.component.html',
  styleUrls: ['./incidentals.component.scss']
})
export class IncidentalsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() supportDetailsForm: FormGroup;
  @Input() noOfHouseholdMembers: number;
  referralForm: FormGroup;
  totalAmount = 0;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

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
}
