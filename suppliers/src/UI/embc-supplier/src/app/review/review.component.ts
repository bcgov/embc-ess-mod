import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../service/supplier.service';
import { Router } from '@angular/router';
import { SupplierHttpService } from '../service/supplierHttp.service';
import * as globalConst from 'src/app/service/globalConstants';
import { AlertService } from '../service/alert.service';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})

export class ReviewComponent implements OnInit {
    supplierSubmissionType: string;
    supplier: any;
    captchaVerified = false;
    captchaFilled = false;
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

        if (!this.captchaFilled) {
            this.alertService.setAlert('danger', globalConst.captchaErr);
            this.isSubmitted = !this.isSubmitted;
            this.showLoader = !this.showLoader;
        } else {
            this.httpService.submitForm(this.supplierService.getPayload()).subscribe((res: any) => {
                this.supplierService.setReferenceNumber(res);
                this.router.navigate(['/thankyou']);
            },
            (error: any) => {
                this.isSubmitted = !this.isSubmitted;
                this.showLoader = !this.showLoader;

                if (error.title && error.title !== '') {
                    this.alertService.setAlert('danger', error.title);
                } else {
                    this.alertService.setAlert('danger', globalConst.appSubmitErr);
                }
            });
        }
    }

    public onValidToken(token: any) {
        console.log('Valid token received: ', token);
        this.captchaVerified = true;
        this.captchaFilled = true;
        this.alertService.clearAlert();
    }

    public onServerError(error: any) {
        console.log('Server error: ', error);
        this.captchaVerified = true;
        this.captchaFilled = true;
    }
}
