import { Component, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-community-management',
  templateUrl: './community-management.component.html',
  styleUrls: ['./community-management.component.scss']
})
export class CommunityManagementComponent implements OnInit {

  tabs: TabModel[] = [
    {
      label: 'Community List',
      route: 'list',
    },
    {
      label: 'Add/Edit Community List',
      route: 'add-edit',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
