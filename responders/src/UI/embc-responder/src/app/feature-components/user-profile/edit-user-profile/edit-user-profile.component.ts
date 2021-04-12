import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';


@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {

  editForm: FormGroup;
  teamMember: TeamMember;
  readonly phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(
    private builder: FormBuilder, private router: Router, private customValidation: CustomValidationService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.teamMember = JSON.parse(this.cacheService.get('userMemberTeamInfo'));
    this.constructEditForm();
  }

  get editFormControl(): { [key: string]: AbstractControl; } {
    return this.editForm.controls;
  }

  constructEditForm(): void {
    this.editForm = this.builder.group({
      firstName: [this.teamMember?.firstName, [this.customValidation.whitespaceValidator()]],
      lastName: [this.teamMember?.lastName, [this.customValidation.whitespaceValidator()]],
      userName: [{ value: this.teamMember?.userName, disabled: true }],
      role: [{ value: this.teamMember?.role, disabled: true }],
      label: [{ value: this.teamMember?.label, disabled: true }],
      email: [this.teamMember?.email, [Validators.email]],
      phone: [this.teamMember?.phone, [this.customValidation.maskedNumberLengthValidator()]]
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/user-profile']);
  }

  save(): void {

  }

}
