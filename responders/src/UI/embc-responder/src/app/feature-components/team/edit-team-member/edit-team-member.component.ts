import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberLabel, MemberLabelDescription, MemberRole, MemberRoleDescription, TeamMember } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TeamListDataService } from '../team-list/team-list-data.service';
import { EditTeamMemberService } from './edit-team-member.service';

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
    private editTeamMemberService: EditTeamMemberService, private alertService: AlertService) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      const state = this.router.getCurrentNavigation().extras.state as TeamMember;
      this.teamMember = state;
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  ngOnInit(): void {
    this.constructEditForm();
    this.roles = this.listService.getMemberRoles();
    this.labels = this.listService.getMemberLabels();
  }

  get editFormControl(): { [key: string]: AbstractControl; } {
    return this.editForm.controls;
  }

  constructEditForm(): void {
    this.editForm = this.builder.group({
      firstName: [this.teamMember.firstName, [this.customValidation.whitespaceValidator()]],
      lastName: [this.teamMember.lastName, [this.customValidation.whitespaceValidator()]],
      userName: [{ value: this.teamMember.userName, disabled: this.isEditAllowed() }, [this.customValidation.whitespaceValidator()]],
      role: [this.teamMember.role, [this.customValidation.whitespaceValidator()]],
      label: [this.teamMember.label],
      email: [{ value: this.teamMember.email, disabled: true }],
      phone: [{ value: this.teamMember.phone, disabled: true }]
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-details'], { state: this.teamMember });
  }

  isEditAllowed(): boolean {
    return (this.teamMember.lastSuccessfulLogin !== null && this.teamMember.lastSuccessfulLogin !== '');
  }

  next(): void {
    let updatedTeamMember: TeamMember = this.editForm.getRawValue();
    this.router.navigate(['/responder-access/responder-management/details/review'], { state: { ...this.teamMember, ...updatedTeamMember } });
  }

  checkUserName($event) {
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
      this.alertService.setAlert('danger', error.error.title);
    })
  }

}
