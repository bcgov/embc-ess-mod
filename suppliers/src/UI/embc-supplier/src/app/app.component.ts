import { Component } from '@angular/core';
import { SupplierHttpService } from './service/supplierHttp.service';
import { SupplierService } from './service/supplier.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'embc-supplier';

  constructor(private supplierHttp: SupplierHttpService, private supplierService: SupplierService) {
    this.setUpData();
  }

  setUpData() {
    this.supplierHttp.getListOfCities().subscribe((data: any[]) => {
      this.supplierService.setCityList(data);
    });

    this.supplierHttp.getListOfProvinces().subscribe((data: any[]) => {
      this.supplierService.setProvinceList(data);
    });

    this.supplierHttp.getListOfCountries().subscribe((data: any[]) => {
      this.supplierService.setCountryList(data);
    });

    this.supplierHttp.getListOfStates().subscribe((data: any[]) => {
      this.supplierService.setStateList(data);
    });

    this.supplierHttp.getListOfSupportItems().subscribe((data: any[]) => {
      this.supplierService.setSupportItems(data);
    });
  }
}
