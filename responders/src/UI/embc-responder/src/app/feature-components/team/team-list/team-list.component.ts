import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { TeamListDataService } from './team-list-data.service';
import { TeamListService } from './team-list.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  constructor(private teamListService: TeamListService, private router: Router, private teamDataService: TeamListDataService,
    private dialog: MatDialog) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      const state = this.router.getCurrentNavigation().extras.state;
      let displayText: string = '';
      if(state?.action === "delete") {
        console.log(state?.action);
        displayText = globalConst.deleteMessage;
      } else if(state?.action === "edit") {
        displayText = globalConst.editMessage;
      } else {
        displayText = "Hello.. Something went wrong";
      }
      setTimeout(() => {
        this.openConfirmation(displayText);
      }, 500)
    } 
   }

  filterTerm: TableFilterValueModel;
  filtersToLoad: TableFilterModel;
  displayedColumns: TableColumnModel[];
  filterPredicate: (data: TeamMember, filter: string) => boolean;
  teamMembers: TeamMember[];

  ngOnInit(): void {
    this.teamFilterPredicate();
    this.teamDataService.clear();
    this.teamListService.getTeamMembers().subscribe(values => {
      this.teamMembers = values;
    });
    this.filtersToLoad = this.teamDataService.filtersToLoad;
    this.displayedColumns = this.teamDataService.displayedColumns;
  }

  filter(event: TableFilterValueModel): void {
    this.filterTerm = event;
  }

  teamFilterPredicate(): void {
    const filterPredicate = (data: TeamMember, filter: string): boolean => {
      const searchString: TableFilterValueModel = JSON.parse(filter);
      if (searchString.value === 'All User Roles' || searchString.value === 'Active & Deactivated Users' || searchString.value === 'All Labels') {
        return true;
      }
      if (searchString.type === 'text') {
        if (data.lastName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1) {
          return true;
        }
        else if (data.userName.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1) {
          return true;
        }
        else { return false; }
      } else {
        return data.role.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
          // data.isActive.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1 ||
          data.label.trim().toLowerCase().indexOf(searchString.value.trim().toLowerCase()) !== -1;
      }

      // if (searchString.type === 'role') {
      //   return data.role.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }

      // if (searchString.type === 'status') {
      //   return data.status.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }

      // if (searchString.type === 'label') {
      //   return data.label.toLowerCase().trim().indexOf(searchString.value.toLowerCase()) != -1
      // }
    };
    this.filterPredicate = filterPredicate;
  }

  openMemberDetails($event: TeamMember): void {
    this.teamDataService.setSelectedTeamMember($event);
    this.router.navigate(['/responder-access/responder-management/details/member-details'], { state: $event });
  }

  activateTeamMember($event: string): void {
    this.teamListService.activateTeamMember($event).subscribe(value => {
      console.log(value);
      this.teamMembers = value;
    }, (error) => {
      console.log('here');
    });
  }

  deactivateTeamMember($event: string): void {
    this.teamListService.deactivatedTeamMember($event).subscribe(value => {
      console.log(value);
      this.teamMembers = value;
    });
  }

  addTeamMember(): void {
    this.router.navigate(['/responder-access/responder-management/add-member'])
  }

  openConfirmation(text: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text: text
      },
      height: '230px',
      width: '530px'
    });
  }
}


