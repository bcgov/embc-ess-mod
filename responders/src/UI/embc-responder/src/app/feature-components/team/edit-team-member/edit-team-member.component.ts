import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberLabelDescription, MemberRole, MemberRoleDescription, TeamMember } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { EditTeamMemberService } from './edit-team-member.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-edit-team-member',
  templateUrl: './edit-team-member.component.html',
  styleUrls: ['./edit-team-member.component.scss']
})
export class EditTeamMemberComponent implements OnInit {

  editForm: FormGroup;
  teamMember: TeamMember;
  roles: MemberRoleDescription[];
  labels: MemberLabelDescription[];
  showLoader = false;
  color = '#169BD5';

  constructor(private builder: FormBuilder, private router: Router, private teamDataService: TeamListDataService,
              private listService: LoadTeamListService, private customValidation: CustomValidationService,
              private editTeamMemberService: EditTeamMemberService, private alertService: AlertService, private userService: UserService) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as TeamMember;
        this.teamMember = state;
      }
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  /**
   * On component init, constructs the form and loads the lists
   */
  ngOnInit(): void {
    this.constructEditForm();
    this.roles = this.filteredRoleList();
    this.labels = this.listService.getMemberLabels();
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
      firstName: [this.teamMember.firstName, [this.customValidation.whitespaceValidator()]],
      lastName: [this.teamMember.lastName, [this.customValidation.whitespaceValidator()]],
      userName: [{ value: this.teamMember.userName, disabled: this.isEditAllowed() },
      [this.customValidation.whitespaceValidator()]],
      role: [{ value: this.teamMember.role, disabled: this.isNotTier2() }, [this.customValidation.whitespaceValidator()]],
      label: [this.teamMember.label],
      email: [{ value: this.teamMember.email, disabled: true }],
      phone: [{ value: this.teamMember.phone, disabled: true }]
    });
  }

  /**
   * Navigates to the details page
   */
  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-details'], { state: this.teamMember });
  }

  /**
   * Checks if the username is editable
   *
   * @returns true/false
   */
  isEditAllowed(): boolean {
    return this.teamMember.isUserNameEditable;
  }

  /**
   * Navigates to the review page
   */
  next(): void {
    const updatedTeamMember: TeamMember = this.editForm.getRawValue();
    this.router.navigate(['/responder-access/responder-management/details/review'],
      { state: { ...this.teamMember, ...updatedTeamMember } });
  }

  /**
   * Checks if the bceid username exists in the ERA system
   *
   * @param $event username input change event
   */
  checkUserName($event): void {
    this.showLoader = !this.showLoader;
    this.editTeamMemberService.checkUserNameExists($event.target.value).subscribe(value => {
      this.showLoader = !this.showLoader;
      this.editForm.get('userName').setValidators([this.customValidation.whitespaceValidator(),
      this.customValidation.userNameExistsValidator(value).bind(this.customValidation)]);
      this.editForm.get('userName').updateValueAndValidity();
      if (value) {
        this.editForm.get('userName').updateValueAndValidity();
      } else {
        this.editForm.updateValueAndValidity();
      }
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.usernameCheckerror);
    });
  }

  /**
   * Filters the list based on user role
   *
   * @returns member role list
   */
   filteredRoleList(): MemberRoleDescription[] {
    const loggedInRole = this.userService.currentProfile.role;
    if (loggedInRole === MemberRole.Tier2) {
      return this.listService.getMemberRoles().filter(role => role.code === MemberRole.Tier1);
    } else if (loggedInRole === MemberRole.Tier3) {
      return this.listService.getMemberRoles().filter(role => role.code === MemberRole.Tier1 || role.code === MemberRole.Tier2);
    } else if (loggedInRole === MemberRole.Tier4) {
      return this.listService.getMemberRoles().filter(role => role.code === MemberRole.Tier1
        || role.code === MemberRole.Tier2 || role.code === MemberRole.Tier3);
    }
  }

  /**
   * Checks if the logged in user role is not Tier2
   *
   * @returns true/false
   */
  isNotTier2(): boolean {
    return this.userService.currentProfile.role === MemberRole.Tier2;
  }

}
