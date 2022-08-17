import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { RestrictionService } from '../../../feature-components/restriction/restriction.service';

@Component({
  selector: 'app-confirm-restriction',
  templateUrl: './confirm-restriction.component.html',
  styleUrls: ['./confirm-restriction.component.scss']
})
export class ConfirmRestrictionComponent implements OnInit, OnDestroy {
  restrictionForm: UntypedFormGroup;
  restrictionForm$: Subscription;

  constructor(
    private router: Router,
    private formCreationService: FormCreationService,
    public restrictionService: RestrictionService
  ) {}

  /**
   * Initializes and loads the confirm-restriction form
   */
  ngOnInit(): void {
    this.restrictionForm$ = this.formCreationService
      .getRestrictionForm()
      .subscribe((restrictionForm) => {
        this.restrictionForm = restrictionForm;
      });
  }

  /**
   * Back navigation
   */
  goBack(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  /**
   * Next navigation
   */
  needsAssessment(): void {
    if (this.restrictionForm.status === 'VALID') {
      this.restrictionService.restrictedAccess =
        this.restrictionForm.get('restrictedAccess').value;
      this.router.navigate(['/verified-registration/needs-assessment']);
    } else {
      this.restrictionForm.markAllAsTouched();
    }
  }

  /**
   * Destroys the subscription on page destroy
   */
  ngOnDestroy(): void {
    this.restrictionForm$.unsubscribe();
  }
}
