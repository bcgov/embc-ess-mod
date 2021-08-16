import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AddSupplierService } from '../add-supplier/add-supplier.service';
import { ExistingSupplier } from '../suppliers-list/supplier-list-data.service';

@Component({
  selector: 'app-supplier-exist',
  templateUrl: './supplier-exist.component.html',
  styleUrls: ['./supplier-exist.component.scss']
})
export class SupplierExistComponent implements OnInit {
  dummyData: ExistingSupplier[] = [
    {
      legalName: 'Save-on-Foods Ltd',
      name: 'SAVE-ON-FOODS',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      gstNumber: { part1: '222222222', part2: '2222' },
      primaryTeam: null
    },
    {
      legalName: 'Master Foods',
      name: 'FRESH FOODS',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      gstNumber: { part1: '999999999', part2: '9999' },
      primaryTeam: 'ESS Team'
    },
    {
      legalName: 'Hotels Inc.',
      name: 'SLEEP EASY HOTEL',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      gstNumber: { part1: '333333333', part2: '3333' },
      primaryTeam: 'ESS Team Name'
    },
    {
      legalName: 'Victoria Cabs',
      name: 'VICTORIA CABS',
      address: {
        addressLine1: '120 Main Street',
        addressLine2: 'Office 123',
        postalCode: 'V6Z 0G7',
        stateProvince: {
          code: 'BC',
          countryCode: 'CA',
          name: 'British Columbia'
        },
        community: 'Victoria',
        country: { code: 'CA', name: 'Canada' }
      },
      gstNumber: { part1: '555555555', part2: '9999' },
      primaryTeam: null
    }
  ];
  displayedColumns: string[] = [
    'legalName',
    'name',
    'gstNumber',
    'address',
    'primaryTeam'
  ];
  dataSource = new BehaviorSubject([]);
  constructor(
    private addSupplierService: AddSupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource.next(this.dummyData);
  }

  continue(): void {}
  close(): void {
    this.addSupplierService.clearAddedSupplier();
    this.router.navigate([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }
  claimSupplier($event): void {
    console.log($event);
  }
}
