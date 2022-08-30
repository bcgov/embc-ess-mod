import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GetInvoiceResponse, Invoice } from '../core/api/models';
import { InvoicesService, MockCasService } from '../core/api/services';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditInvoiceDialog } from '../dialogs/edit-invoice/edit-invoice.dialog';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[];
  displayedColumns: string[] = ['invNum', 'name', 'amount', 'date', 'supplierNumber', 'actions'];
  dataSource: MatTableDataSource<Invoice> = new MatTableDataSource();

  constructor(private invoicesService: InvoicesService,
    private mockCasService: MockCasService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoicesService.invoicesGet().subscribe({
      next: (res: Invoice[]) => {
        this.invoices = res;
        this.dataSource = new MatTableDataSource(this.invoices);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  edit(invoiceNumber: string) {
    this.mockCasService.mockCasGetInvoice({ payGroup: 'EMB Inc', invoicenumber: invoiceNumber }).subscribe({
      next: (res: GetInvoiceResponse) => {
        let invoice = { paymentDate: '', paymentStatus: '' };
        if (res.items?.length == 1) {
          invoice.paymentDate = res.items[0].paymentdate || '';
          invoice.paymentStatus = res.items[0].paymentstatus || '';
        }
        let dialogRef = this.dialog.open(EditInvoiceDialog, {
          autoFocus: false,
          width: '40vw',
          data: { invoiceNumber: invoiceNumber, ...invoice }
        });

        dialogRef.afterClosed()
          .subscribe((result) => {
            this.loadInvoices();
          });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteInvoice(invoiceNumber: string) {
    let params = { invoiceNumber: invoiceNumber };
    this.invoicesService.invoicesDeleteInvoiceByNumber(params).subscribe({
      next: (res: number) => {
        this.loadInvoices();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}

export interface TableColumnModel {
  label: string;
  ref: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
