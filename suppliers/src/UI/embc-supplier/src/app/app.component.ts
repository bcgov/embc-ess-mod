import { Component } from '@angular/core';
import { SupplierHttpService } from './service/supplierHttp.service';
import { SupplierService } from './service/supplier.service';
import { ConfigGuard } from './service/config.guard';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'embc-supplier';
  noticeMsg = '';
  maintMsg = '';
  siteDown = false;
  bannerSubscription: Subscription;

  constructor(
    private supplierHttp: SupplierHttpService,
    private supplierService: SupplierService
  ) {
    this.setUpData();
  }

  ngOnInit() {
    this.bannerSubscription = this.supplierService.getServerConfig().subscribe(config => {
      this.noticeMsg = config.noticeMsg;
      this.maintMsg = config.maintMsg;
      this.siteDown = config.siteDown;
    });
  }

  setUpData() {
    this.supplierService.setServerConfig(this.supplierHttp.getServerConfig());

    this.supplierService.setCityList(this.supplierHttp.getListOfCities());
    this.supplierService.setProvinceList(this.supplierHttp.getListOfProvinces());
    this.supplierService.setStateList(this.supplierHttp.getListOfStates());
    this.supplierService.setCountryList(this.supplierHttp.getListOfCountries());

    this.supplierHttp.getListOfSupportItems().subscribe((data: any[]) => {
      this.supplierService.setSupportItems(data);
    });
  }

  ngOnDestroy() {
    this.bannerSubscription.unsubscribe();
  }
}
