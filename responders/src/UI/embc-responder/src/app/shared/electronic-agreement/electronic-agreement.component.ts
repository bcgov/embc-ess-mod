import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-electronic-agreement',
  templateUrl: './electronic-agreement.component.html',
  styleUrls: ['./electronic-agreement.component.scss']
})
export class ElectronicAgreementComponent implements OnInit {

  agreementAccepted = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submitEAA(): void {
    this.router.navigate(['/responder-access/responder-dashboard']);
  }

  agreementChangeEvent(event: MatCheckboxChange): void {
    this.agreementAccepted = event.checked;
  }

}
