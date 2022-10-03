import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ContactService } from './contact.service';

export class CustomErrorMailMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) || control.parent.hasError('emailMatch')
    );
  }
}

export class CustomErrorMobileMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) || control.parent.hasError('mobileMatch')
    );
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactInfoForm: UntypedFormGroup;
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  emailMatcher = new CustomErrorMailMatcher();
  tabUpdateSubscription: Subscription;

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private contactService: ContactService,
    private evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.contactService.init();
    this.contactInfoForm = this.contactService.createForm();

    this.contactInfoForm
      .get('phone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('phone').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('email')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('email').reset();
          this.contactInfoForm.get('confirmEmail').reset();
          this.contactInfoForm.get('confirmEmail').disable();
        } else {
          this.contactInfoForm.get('confirmEmail').enable();
        }
        this.contactInfoForm.get('phone').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('confirmEmail')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('confirmEmail').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('phone').updateValueAndValidity();
      });

    this.tabUpdateSubscription = this.contactService.updateTabStatus(
      this.contactInfoForm
    );
  }

  /**
   * Returns the control of the form
   */
  get contactFormControl(): { [key: string]: AbstractControl } {
    return this.contactInfoForm.controls;
  }

  hideContact(event: MatRadioChange): void {
    if (!event.value) {
      this.contactInfoForm.get('phone').reset();
      this.contactInfoForm.get('email').reset();
      this.contactInfoForm.get('confirmEmail').reset();
      this.contactService.updateOnVisibility(this.contactInfoForm);
    }
  }

  /**
   * Navigate to next tab
   */
  next(): void {
    if (this.evacueeSessionService.isPaperBased) {
      this.stepEvacueeProfileService.nextTabUpdate.next();
      if (this.stepEvacueeProfileService.checkTabsStatus()) {
        this.stepEvacueeProfileService.openModal(
          globalConst.wizardProfileMessage
        );
      } else {
        this.router.navigate([this.contactService?.tabMetaData?.next]);
      }
    } else {
      this.router.navigate([this.contactService?.tabMetaData?.next]);
    }
  }

  /**
   * Navigates to previous tab
   */
  back(): void {
    this.router.navigate([this.contactService?.tabMetaData?.previous]);
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.contactService.cleanup(this.contactInfoForm);
    this.tabUpdateSubscription.unsubscribe();
  }
}
