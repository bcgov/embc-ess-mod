import { Component, OnInit } from '@angular/core';

import { TabModel } from 'src/app/core/models/tab.model';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.scss'],
  standalone: true,
  imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, MatTabNavPanel, RouterOutlet]
})
export class SupplierManagementComponent {
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
}
