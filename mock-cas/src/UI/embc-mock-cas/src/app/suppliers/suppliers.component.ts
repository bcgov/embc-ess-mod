import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GetSupplierResponse } from '../core/api/models';
import { SupplierService } from '../core/api/services';
import { AddSupplierDialog } from '../dialogs/add-supplier/add-supplier.dialog';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  suppliers: GetSupplierResponse[];
  displayedColumns: string[] = ['supplierNumber', 'name', 'actions'];
  dataSource: MatTableDataSource<GetSupplierResponse> = new MatTableDataSource();
  constructor(private suppliersService: SupplierService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.suppliersService.supplierGet().subscribe({
      next: (res: GetSupplierResponse[]) => {
        this.suppliers = res;
        this.dataSource = new MatTableDataSource(this.suppliers);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  addSupplier() {
    let dialogRef = this.dialog.open(AddSupplierDialog, {
      autoFocus: false,
      width: '60vw',
      data: {}
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        this.loadSuppliers();
      });
  }

  deleteSupplier(suppliername: string) {
    let params = { supplierName: suppliername };
    this.suppliersService.supplierDeleteSupplierByName(params).subscribe({
      next: (res: number) => {
        this.loadSuppliers();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
