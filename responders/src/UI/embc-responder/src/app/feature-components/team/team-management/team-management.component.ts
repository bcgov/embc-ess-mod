import { Component, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {


  tabs: TabModel[] = [
    {
      label: 'ESS Team',
      route: 'details',
    },
    {
      label: 'Add Team Members',
      route: 'add',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
