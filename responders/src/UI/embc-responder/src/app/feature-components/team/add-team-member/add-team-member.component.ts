import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  MemberLabelDescription,
  MemberRole,
  MemberRoleDescription,
  TeamMember
} from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../../core/services/global-constants';
import { AddTeamMemberService } from './add-team-member.service';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit {
  addForm: UntypedFormGroup;
  roles: MemberRoleDescription[];
  labels: MemberLabelDescription[];
  detailsText: string;
  showLoader = false;
  color = '#169BD5';

  constructor(
    private builder: UntypedFormBuilder,
    private router: Router,
    private listService: LoadTeamListService,
    private customValidation: CustomValidationService,
    private addTeamMemberService: AddTeamMemberService,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  /**
   * On component init, constructs the form and loads the lists
   */
  ngOnInit(): void {
    this.constructAddForm();
    if (this.addTeamMemberService.getAddedTeamMember() !== undefined) {
      this.addForm.patchValue(this.addTeamMemberService.getAddedTeamMember());
    }
    this.roles = this.filteredRoleList();
    this.labels = this.listService.getMemberLabels();
    this.addForm.get('role').setValue(globalConst.defaultRole.code);
    this.detailsText = globalConst.tier1Notes;
  }

  /**
   * Returns form control
   */
  get addFormControl(): { [key: string]: AbstractControl } {
    return this.addForm.controls;
  }

  /**
   * Builds the form
   */
  constructAddForm(): void {
    this.addForm = this.builder.group({
      firstName: ['', [this.customValidation.whitespaceValidator()]],
      lastName: ['', [this.customValidation.whitespaceValidator()]],
      userName: ['', [this.customValidation.whitespaceValidator()]],
      role: ['', [this.customValidation.whitespaceValidator()]],
      label: [null]
    });
  }

  /**
   * Navigates to the team members list
   */
  cancel(): void {
    this.router.navigate([
      '/responder-access/responder-management/details/member-list'
    ]);
  }

  /**
   * Navigates to the review page
   */
  next(): void {
    // Validate if username exists before sending the form
    this.showLoader = !this.showLoader;
    this.addTeamMemberService
      .checkUserNameExists(this.addForm.get('userName').value)
      .subscribe({
        next: (value) => {
          this.addForm
            .get('userName')
            .setValidators([
              this.customValidation.whitespaceValidator(),
              this.customValidation
                .userNameExistsValidator(value)
                .bind(this.customValidation)
            ]);
          this.addForm.get('userName').updateValueAndValidity();
          this.showLoader = !this.showLoader;
          if (value) {
            this.addForm.get('userName').updateValueAndValidity();
          } else {
            this.addForm.updateValueAndValidity();

            const newTeamMember: TeamMember = this.addForm.getRawValue();
            newTeamMember.teamName = this.userService.currentProfile.teamName;
            this.addTeamMemberService.setAddedTeamMember(newTeamMember);
            this.router.navigate(
              ['/responder-access/responder-management/details/review'],
              { state: newTeamMember }
            );
          }
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.usernameCheckerror);
        }
      });
  }

  /**
   * Display notes for the role selected
   *
   * @param selectedRole role selected from dropdown
   */
  roleSelectionChange(selectedRole: MatSelectChange): void {
    if (selectedRole.value === MemberRole.Tier1) {
      this.detailsText = globalConst.tier1Notes;
    } else if (selectedRole.value === MemberRole.Tier2) {
      this.detailsText = globalConst.tier2Notes;
    } else if (selectedRole.value === MemberRole.Tier3) {
      this.detailsText = globalConst.tier3Notes;
    }
  }

  /**
   * Checks if the bceid username exists in the ERA system
   *
   * @param $event username input change event
   */
  checkUserName($event): void {
    this.showLoader = !this.showLoader;
    this.addTeamMemberService
      .checkUserNameExists($event.target.value)
      .subscribe({
        next: (value) => {
          this.showLoader = !this.showLoader;
          this.addForm
            .get('userName')
            .setValidators([
              this.customValidation.whitespaceValidator(),
              this.customValidation
                .userNameExistsValidator(value)
                .bind(this.customValidation)
            ]);
          this.addForm.get('userName').updateValueAndValidity();
          if (value) {
            this.addForm.get('userName').updateValueAndValidity();
          } else {
            this.addForm.updateValueAndValidity();
          }
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.usernameCheckerror);
        }
      });
  }

  /**
   * Filters the list based on user role
   *
   * @returns member role list
   */
  filteredRoleList(): MemberRoleDescription[] {
    const loggedInRole = this.userService?.currentProfile?.role;
    if (loggedInRole === MemberRole.Tier2) {
      return this.listService
        .getMemberRoles()
        .filter((role) => role.code === MemberRole.Tier1);
    } else if (loggedInRole === MemberRole.Tier3) {
      return this.listService
        .getMemberRoles()
        .filter(
          (role) =>
            role.code === MemberRole.Tier1 || role.code === MemberRole.Tier2
        );
    } else if (loggedInRole === MemberRole.Tier4) {
      return this.listService
        .getMemberRoles()
        .filter(
          (role) =>
            role.code === MemberRole.Tier1 ||
            role.code === MemberRole.Tier2 ||
            role.code === MemberRole.Tier3
        );
    }
  }
}
