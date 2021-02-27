import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-assigned-community-management',
  templateUrl: './assigned-community-management.component.html',
  styleUrls: ['./assigned-community-management.component.scss']
})
export class AssignedCommunityManagementComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    console.log("**************ON-DESTROY***************")
  }

  ngOnInit(): void {
    
  }

}
