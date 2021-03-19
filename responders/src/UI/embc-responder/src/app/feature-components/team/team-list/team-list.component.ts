import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMember } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { TeamListDataService } from './team-list-data.service';
import { TeamListService } from './team-list.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  constructor(private teamListService: TeamListService, private router: Router, private teamDataService: TeamListDataService) { }

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
}


