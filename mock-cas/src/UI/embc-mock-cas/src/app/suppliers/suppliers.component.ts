import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetSupplierResponse } from '../core/api/models';
import { SupplierService } from '../core/api/services';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  suppliers: GetSupplierResponse[];
  displayedColumns: string[] = ['supplierNumber', 'name'];
  dataSource: MatTableDataSource<GetSupplierResponse> = new MatTableDataSource();
  constructor(private suppliersService: SupplierService) { }

  ngOnInit(): void {
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

}
