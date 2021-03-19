import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberLabel, MemberRole, TeamMember } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit {

  addForm: FormGroup;
  roles: MemberRole[];
  labels: MemberLabel[];

  constructor(private builder: FormBuilder, private router: Router, private listService: LoadTeamListService,
    private customValidation: CustomValidationService) { }

  ngOnInit(): void {
    this.constructAddForm();
    this.roles = this.listService.getMemberRoles();
    this.labels = this.listService.getMemberLabels();
  }

  get addFormControl(): { [key: string]: AbstractControl; } {
    return this.addForm.controls;
  }

  constructAddForm(): void {
    this.addForm = this.builder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      label: ['']
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-list']);
  }

  next(): void {
    let newTeamMember: TeamMember = this.addForm.getRawValue();
    this.router.navigate(['/responder-access/responder-management/details/review'], { state: newTeamMember });
  }


}
