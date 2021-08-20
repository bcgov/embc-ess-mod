import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AddSupplierService } from '../add-supplier/add-supplier.service';

@Component({
  selector: 'app-supplier-exist',
  templateUrl: './supplier-exist.component.html',
  styleUrls: ['./supplier-exist.component.scss']
})
export class SupplierExistComponent implements OnInit {
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
    console.log(this.addSupplierService.existingSuppliersList);
    this.dataSource.next(this.addSupplierService.existingSuppliersList);
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
