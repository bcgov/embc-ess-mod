import { Component } from '@angular/core';
import { SupplierHttpService } from './core/services/supplierHttp.service';
import { SupplierService } from './core/services/supplier.service';
import { ConfigGuard } from './core/guards/config.guard';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './core/services/authentication.service';

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
    private supplierService: SupplierService,
    private authService: AuthenticationService
  ) {
    this.setUpData();
    this.authService.init();
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
