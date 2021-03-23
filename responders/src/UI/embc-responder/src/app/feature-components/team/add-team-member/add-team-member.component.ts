import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { MemberLabelDescription, MemberRoleDescription, TeamMember } from 'src/app/core/api/models';
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

  addForm: FormGroup;
  roles: MemberRoleDescription[];
  labels: MemberLabelDescription[];
  detailsText: string;
  showLoader = false;
  color = '#169BD5';
  defaultRole = {
    code: "Tier1",
    description: "Tier 1 (Responder)"
  }

  constructor(private builder: FormBuilder, private router: Router, private listService: LoadTeamListService,
    private customValidation: CustomValidationService, private addTeamMemberService: AddTeamMemberService,
    private alertService: AlertService, private userService: UserService) { }

  ngOnInit(): void {
    this.constructAddForm();
    if (this.addTeamMemberService.getAddedTeamMember() !== undefined) {
      this.addForm.patchValue(this.addTeamMemberService.getAddedTeamMember());
    }
    this.roles = this.listService.getMemberRoles();
    this.labels = this.listService.getMemberLabels();
    this.addForm.get('role').setValue(this.defaultRole.code);
    this.detailsText = globalConst.tier1Notes;
  }

  get addFormControl(): { [key: string]: AbstractControl; } {
    return this.addForm.controls;
  }

  constructAddForm(): void {
    this.addForm = this.builder.group({
      firstName: ['', [this.customValidation.whitespaceValidator()]],
      lastName: ['', [this.customValidation.whitespaceValidator()]],
      userName: ['', [this.customValidation.whitespaceValidator()]],
      role: ['', [this.customValidation.whitespaceValidator()]],
      label: ['']
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-list']);
  }

  next(): void {
    const newTeamMember: TeamMember = this.addForm.getRawValue();
    newTeamMember.teamName = this.userService.currentProfile.teamName;
    this.addTeamMemberService.setAddedTeamMember(newTeamMember);
    this.router.navigate(['/responder-access/responder-management/details/review'], { state: newTeamMember });
  }

  roleSelectionChange(selectedRole: MatSelectChange): void {
    if (selectedRole.value === 'Tier1') {
      this.detailsText = globalConst.tier1Notes;
    } else if (selectedRole.value === 'Tier2') {
      this.detailsText = globalConst.tier2Notes;
    } else if (selectedRole.value === 'Tier3') {
      this.detailsText = globalConst.tier3Notes;
    }
  }

  checkUserName($event): void {
    this.showLoader = !this.showLoader;
    this.addTeamMemberService.checkUserNameExists($event.target.value).subscribe(value => {
      this.showLoader = !this.showLoader;
      this.addForm.get('userName').setValidators([this.customValidation.whitespaceValidator(),
      this.customValidation.userNameExistsValidator(value).bind(this.customValidation)]);
      this.addForm.get('userName').updateValueAndValidity();
      if (value) {
        this.addForm.get('userName').updateValueAndValidity();
      } else {
        this.addForm.updateValueAndValidity();
      }
    }, (error) => {
      this.showLoader = !this.showLoader;
      this.alertService.setAlert('danger', error.error.title);
    });
  }

}
