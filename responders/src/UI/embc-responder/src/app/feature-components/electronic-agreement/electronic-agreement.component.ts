import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ElectronicAgreementService } from './electronic-agreement.service';

@Component({
  selector: 'app-electronic-agreement',
  templateUrl: './electronic-agreement.component.html',
  styleUrls: ['./electronic-agreement.component.scss'],
})
export class ElectronicAgreementComponent implements OnInit {
  agreementAccepted = false;

  constructor(
    private router: Router,
    private eaaService: ElectronicAgreementService
  ) {}

  ngOnInit(): void {}

  submitEAA(): void {
    this.eaaService.signAgreement().subscribe(() => {
      this.router.navigateByUrl('responder-access');
    });
  }

  agreementChangeEvent(event: MatCheckboxChange): void {
    this.agreementAccepted = event.checked;
  }
}
