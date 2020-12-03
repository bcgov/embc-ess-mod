import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Component({
  selector: 'app-confirm-restriction',
  templateUrl: './confirm-restriction.component.html',
  styleUrls: ['./confirm-restriction.component.scss']
})
export class ConfirmRestrictionComponent implements OnInit {

  restrictionForm: FormGroup;
  restrictionForm$: Subscription;

  constructor(private router: Router, private formCreationService: FormCreationService) { }

  ngOnInit(): void {
    this.restrictionForm$ = this.formCreationService.getRestrictionForm().subscribe(
      restrictionForm => {
        this.restrictionForm = restrictionForm;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/verified-registration/view-profile']);
  }

  needsAssessment(): void {
    this.router.navigate(['/verified-registration/needs-assessment']);
  }

}
