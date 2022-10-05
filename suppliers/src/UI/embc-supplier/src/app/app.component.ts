import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupplierHttpService } from './core/services/supplierHttp.service';
import { SupplierService } from './core/services/supplier.service';
import { ConfigGuard } from './core/guards/config.guard';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfigService } from './core/services/config.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'embc-supplier';

  noticeMsg: SafeHtml = '';
  maintMsg: SafeHtml = '';
  siteDown = false;

  bannerSubscription: Subscription;
  listItemSubscription: Subscription;

  constructor(
    private supplierHttp: SupplierHttpService,
    private configService: ConfigService,
    private supplierService: SupplierService,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer
  ) {
    this.setUpData();
    this.authService.init();
  }

  ngOnInit() {
    // This is set in constructor
    if (!this.configService.getServerConfig()) {
      this.configService.setServerConfig(this.supplierHttp.getServerConfig());
    }

    this.bannerSubscription = this.configService.getServerConfig().subscribe(
      (config) => {
        this.noticeMsg = config.noticeMsg
          ? this.sanitizer.bypassSecurityTrustHtml(config.noticeMsg)
          : '';
        this.maintMsg = config.maintMsg
          ? this.sanitizer.bypassSecurityTrustHtml(config.maintMsg)
          : '';
        this.siteDown = config.siteDown;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setUpData() {
    this.configService.setServerConfig(this.supplierHttp.getServerConfig());

    this.supplierService.setCityList(this.supplierHttp.getListOfCities());
    this.supplierService.setProvinceList(
      this.supplierHttp.getListOfProvinces()
    );
    this.supplierService.setStateList(this.supplierHttp.getListOfStates());
    this.supplierService.setCountryList(this.supplierHttp.getListOfCountries());

    this.listItemSubscription = this.supplierHttp
      .getListOfSupportItems()
      .subscribe((data: any[]) => {
        this.supplierService.setSupportItems(data);
      });
  }

  ngOnDestroy() {
    this.bannerSubscription.unsubscribe();
    this.listItemSubscription.unsubscribe();
  }
}
