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

    this.supplierService.setCityList(this.supplierHttp.getListOfCities());
    this.supplierService.setProvinceList(this.supplierHttp.getListOfProvinces());
    this.supplierService.setStateList(this.supplierHttp.getListOfStates());
    this.supplierService.setCountryList(this.supplierHttp.getListOfCountries());
    this.supplierHttp.getListOfSupportItems().subscribe((data: any[]) => {
      this.supplierService.setSupportItems(data);
    });
  }
}
