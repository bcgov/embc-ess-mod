import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-team-member-management',
  templateUrl: './team-member-management.component.html',
  styleUrls: ['./team-member-management.component.scss']
})
export class TeamMemberManagementComponent {
  /**
   * Team Management wrapper component to enable routing via tabs
   */
  tabs: TabModel[] = [
    {
      label: 'ESS Team',
      route: 'details'
    },
    {
      label: 'Add Team Members',
      route: 'add-member'
    }
  ];
}
