import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberLabel, MemberRole, TeamMember } from 'src/app/core/api/models';
import { TeamListDataService } from '../team-list/team-list-data.service';

@Component({
  selector: 'app-edit-team-member',
  templateUrl: './edit-team-member.component.html',
  styleUrls: ['./edit-team-member.component.scss']
})
export class EditTeamMemberComponent implements OnInit {

  editForm: FormGroup;
  teamMember: TeamMember;
  roles = Object.keys(MemberRole).filter(e => e);
  labels = Object.keys(MemberLabel).filter(e => e);

  constructor(private builder: FormBuilder, private router: Router, private teamDataService: TeamListDataService) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      const state = this.router.getCurrentNavigation().extras.state as TeamMember;
      console.log(state);
      this.teamMember = state;
    } else {
      this.teamMember = this.teamDataService.getSelectedTeamMember();
    }
  }

  ngOnInit(): void {
    this.constructEditForm();
  }

  constructEditForm(): void {
    this.editForm = this.builder.group({
      firstName: [this.teamMember.firstName, [Validators.required]],
      lastName: [this.teamMember.lastName, [Validators.required]],
      username: [this.teamMember.userName, [Validators.required]],
      role: [this.teamMember.role, [Validators.required]],
      label: [this.teamMember.label],
      email: [{ value: this.teamMember.email, disabled: true }],
      phone: [{ value: this.teamMember.phone, disabled: true }]
    });
  }

  cancel(): void {
    this.router.navigate(['/responder-access/responder-management/details/member-details'], { state: this.teamMember });
  }

  next(): void {

  }

}
