import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ElectronicAgreementService } from './electronic-agreement.service';
import * as globalConst from '../../core/services/global-constants';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-electronic-agreement',
  templateUrl: './electronic-agreement.component.html',
  styleUrls: ['./electronic-agreement.component.scss']
})
export class ElectronicAgreementComponent implements OnInit {
  agreementAccepted = false;

  constructor(
    private router: Router,
    private eaaService: ElectronicAgreementService,
    private alertService: AlertService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  submitEAA(): void {
    this.eaaService.signAgreement().subscribe({
      next: () => {
        this.userService.loadUserProfile();
        this.router.navigateByUrl('responder-access');
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.agreementError);
      }
    });
  }

  agreementChangeEvent(event: MatCheckboxChange): void {
    this.agreementAccepted = event.checked;
  }
}
