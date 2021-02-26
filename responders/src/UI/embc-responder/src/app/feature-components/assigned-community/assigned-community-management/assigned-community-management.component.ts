import { Component, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-assigned-community-management',
  templateUrl: './assigned-community-management.component.html',
  styleUrls: ['./assigned-community-management.component.scss']
})
export class AssignedCommunityManagementComponent implements OnInit {

  tabs: TabModel[] = [
    {
      label: 'Community List',
      route: 'list',
    },
    // {
    //   label: 'Add/Edit Community List',
    //   route: 'add-edit',
    // }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
