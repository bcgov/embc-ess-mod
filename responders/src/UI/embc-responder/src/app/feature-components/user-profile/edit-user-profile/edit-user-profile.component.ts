import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EditUserProfileService } from './edit-user-profile.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  editForm: UntypedFormGroup;
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
  userProfile: UserProfile;
  showLoader = false;
  color = 'white';
  isSubmitted = true;

  constructor(
    private builder: UntypedFormBuilder,
    private router: Router,
    private customValidation: CustomValidationService,
    private userService: UserService,
    private editUserProfileService: EditUserProfileService,
    private alertService: AlertService
  ) {}

  /**
   * Calls the currentProfile to get the data and display it on screen. Builds the form
   */
  ngOnInit(): void {
    this.userProfile = this.userService.currentProfile;
    this.constructEditForm();
  }

  /**
   * Returns form control
   */
  get editFormControl(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  /**
   * Builds the form
   */
  constructEditForm(): void {
    this.editForm = this.builder.group({
      firstName: [
        this.userProfile?.firstName,
        [this.customValidation.whitespaceValidator()]
      ],
      lastName: [
        this.userProfile?.lastName,
        [this.customValidation.whitespaceValidator()]
      ],
      userName: [{ value: this.userProfile?.userName, disabled: true }],
      role: [{ value: this.userProfile?.role, disabled: true }],
      label: [{ value: this.userProfile?.label, disabled: true }],
      email: [this.userProfile?.email, [Validators.email]],
      phone: [
        this.userProfile?.phone,
        [this.customValidation.maskedNumberLengthValidator()]
      ]
    });
  }

  /**
   * Goes back to the view profile screen without saving changes
   */
  cancel(): void {
    this.router.navigate(['/responder-access/user-profile']);
  }

  /**
   * Saves changes into the Back-end and goes back to view profile screen
   */
  save(): void {
    this.showLoader = !this.showLoader;

    const firstName = this.editForm.get('firstName').value;
    const lastName = this.editForm.get('lastName').value;
    const phone = this.editForm.get('phone').value;
    const email = this.editForm.get('email').value;

    this.editUserProfileService
      .editUserProfile(firstName, lastName, phone, email)
      .subscribe({
        next: async () => {
          this.showLoader = !this.showLoader;
          await this.userService.loadUserProfile();
          this.router.navigate(['/responder-access/user-profile']);
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.editProfileError);
        }
      });
  }
}
