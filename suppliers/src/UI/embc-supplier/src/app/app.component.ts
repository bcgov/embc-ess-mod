import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupplierHttpService } from './service/supplierHttp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'embc-supplier';

  constructor(private supplierHttp: SupplierHttpService) {}

  ngOnInit() {
    this.setUpData();
  }

  setUpData() {
    this.supplierHttp.getListOfCities();
  }
}
