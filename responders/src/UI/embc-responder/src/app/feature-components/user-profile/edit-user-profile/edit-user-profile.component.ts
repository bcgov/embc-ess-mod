import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { UserProfileService } from '../user-profile.service';
import { EditUserProfileService } from './edit-user-profile.service';


@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {

  editForm: FormGroup;
  readonly phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  userProfile: UserProfile;
  showLoader = false;
  color = 'white';


  constructor(
    private builder: FormBuilder, private router: Router,
    private customValidation: CustomValidationService, private userProfileServices: UserProfileService,
    private editUserProfileService: EditUserProfileService) { }

  ngOnInit(): void {
    this.userProfile = this.userProfileServices.getUserProfile();
    this.constructEditForm();
  }

  get editFormControl(): { [key: string]: AbstractControl; } {
    return this.editForm.controls;
  }

  constructEditForm(): void {
    this.editForm = this.builder.group({
      firstName: [this.userProfile.firstName, [this.customValidation.whitespaceValidator()]],
      lastName: [this.userProfile.lastName, [this.customValidation.whitespaceValidator()]],
      userName: [{ value: this.userProfile.userName, disabled: true }],
      role: [{ value: this.userProfile.role, disabled: true }],
      label: [{ value: this.userProfile.role, disabled: true }],
      email: [this.userProfile.email, [Validators.email]],
      phone: [this.userProfile.phone, [this.customValidation.maskedNumberLengthValidator()]]
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/user-profile']);
  }

  save(): void {
    this.showLoader = !this.showLoader;
    if (this.editForm.status === 'VALID') {
      this.userProfileServices.setFirstName(this.editForm.get('firstName').value);
      this.userProfileServices.setLastName(this.editForm.get('lastName').value);
      this.userProfileServices.setEmail(this.editForm.get('email').value);
      this.userProfileServices.setPhone(this.editForm.get('phone').value);

      this.editUserProfileService.editUserProfile().subscribe(() => {
        this.showLoader = !this.showLoader;
        this.router.navigate(['/responder-access/user-profile']);
      });

    } else {
      this.editForm.markAllAsTouched();
    }
  }

}
