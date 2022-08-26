import { Component, OnInit } from '@angular/core';
import { Invoice } from '../core/api/models';
import { InvoicesService } from '../core/api/services';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  constructor(private invoicesService: InvoicesService) { }

  ngOnInit(): void {
    this.invoicesService.invoicesGet().subscribe({
      next: (res: Invoice[]) => {
        this.invoices = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}
