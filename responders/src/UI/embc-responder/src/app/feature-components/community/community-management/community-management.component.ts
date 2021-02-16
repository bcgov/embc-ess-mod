import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-community-management',
  templateUrl: './community-management.component.html',
  styleUrls: ['./community-management.component.scss']
})
export class CommunityManagementComponent implements OnInit {

  tabs: any[] = [
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
