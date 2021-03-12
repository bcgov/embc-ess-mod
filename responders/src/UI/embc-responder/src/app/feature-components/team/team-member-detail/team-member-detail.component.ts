import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TeamMemberDetailsService } from './team-member-details.service';

@Component({
  selector: 'app-team-member-detail',
  templateUrl: './team-member-detail.component.html',
  styleUrls: ['./team-member-detail.component.scss']
})
export class TeamMemberDetailComponent implements OnInit {

  teamMember: TeamMember;

  constructor(private router: Router, private dialog: MatDialog, private teamDetailsService: TeamMemberDetailsService) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      const state = this.router.getCurrentNavigation().extras.state as TeamMember;
      this.teamMember = state;
    }
  }

  ngOnInit(): void {
    console.log(this.teamMember)
  }

  deleteUser() {
    this.dialog.open(DialogComponent, {
      data: {
        body: '<p>You are requesting to delete this user from the ERA Tool.<br> <mat-checkbox id="collection">I confirm that I want this user removed from the ERA Tool, and I am aware this cannot be undone.</mat-checkbox</p>',
        buttons: [
          {
            name: 'No, Cancel',
            class: 'button-s',
            function: 'close'
          },
          {
            name: 'Yes, Delete this user',
            class: 'button-p',
            function: 'delete'
          }
        ]
      },
      height: '250px',
      width: '550px'
    }).afterClosed().subscribe(event => {
      console.log(event)
      if(event === 'delete') {
        this.teamDetailsService.deleteTeamMember(this.teamMember.id).subscribe(value => {
          this.router.navigate(['/responder-access/responder-management/details/member-list'])
        });
      }
    })
  }

  editUser() {

  }

}
