import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as globalConst from 'src/app/core/services/globalConstants';
import { AlertComponent } from '../../core/components/alert/alert.component';
import {
  CaptchaResponse,
  CaptchaResponseType,
  CaptchaV2Component
} from '../../core/components/captcha-v2/captcha-v2.component';
import { LoaderComponent } from '../../core/components/loader/loader.component';
import { AlertService } from '../../core/services/alert.service';
import { SupplierService } from '../../core/services/supplier.service';
import { SupplierHttpService } from '../../core/services/supplierHttp.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone: true,
  imports: [CaptchaV2Component, AlertComponent, LoaderComponent, CurrencyPipe]
})
export class ReviewComponent implements OnInit {
  supplierSubmissionType: string;
  supplier: any;
  captchaResponse: CaptchaResponse;
  isSubmitted = false;
  showLoader = false;

  constructor(
    public supplierService: SupplierService,
    private router: Router,
    private httpService: SupplierHttpService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.supplier = this.supplierService.getSupplierDetails();
    this.supplierSubmissionType = this.supplier?.supplierSubmissionType;
  }

  goback() {
    this.router.navigate(['/submission']);
  }

  submit() {
    this.isSubmitted = !this.isSubmitted;
    this.showLoader = !this.showLoader;
    this.alertService.clearAlert();

    if (this.captchaResponse?.type !== CaptchaResponseType.success) {
      this.alertService.setAlert('danger', globalConst.captchaErr);
      this.isSubmitted = !this.isSubmitted;
      this.showLoader = !this.showLoader;
    } else {
      let payload = this.supplierService.getPayload();
      payload.captcha = this.captchaResponse.resolved;
      this.httpService.submitForm(payload).subscribe(
        (res: any) => {
          this.supplierService.setReferenceNumber(res);
          this.router.navigate(['/thankyou']);
        },
        (error: any) => {
          this.isSubmitted = !this.isSubmitted;
          this.showLoader = !this.showLoader;

          if (error?.title && error.title !== '') {
            this.alertService.setAlert('danger', error.title);
          } else {
            this.alertService.setAlert('danger', globalConst.appSubmitErr);
          }
        }
      );
    }
  }

  print() {
    window.print();
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaResponse = $event;
    if ($event.type === CaptchaResponseType.success) {
      this.alertService.clearAlert();
    }
  }
}
