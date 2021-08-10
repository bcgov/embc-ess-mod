import { Component, OnInit } from '@angular/core';

import { TabModel } from 'src/app/core/models/tab.model';

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.scss']
})
export class SupplierManagementComponent implements OnInit {
  /**
   * Team Management wrapper component to enable routing via tabs
   */
  tabs: TabModel[] = [
    {
      label: 'Supplier List',
      route: 'suppliers-list'
    },
    {
      label: 'Add Supplier',
      route: 'add-supplier'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
