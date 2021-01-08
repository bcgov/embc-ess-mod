import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Component({
  selector: 'app-confirm-restriction',
  templateUrl: './confirm-restriction.component.html',
  styleUrls: ['./confirm-restriction.component.scss']
})
export class ConfirmRestrictionComponent implements OnInit, OnDestroy {

  restrictionForm: FormGroup;
  restrictionForm$: Subscription;

  constructor(private router: Router, private formCreationService: FormCreationService) { }

  /**
   * Initializes and loads the confirm-restriction form
   */
  ngOnInit(): void {
    this.restrictionForm$ = this.formCreationService.getRestrictionForm().subscribe(
      restrictionForm => {
        this.restrictionForm = restrictionForm;
      }
    );
  }

  /**
   * Back navigation
   */
  goBack(): void {
    this.router.navigate(['/verified-registration/view-profile']);
  }

  /**
   * Next navigation
   */
  needsAssessment(): void {
    this.router.navigate(['/verified-registration/needs-assessment']);
  }

  /**
   * Destroys the subscription on page destroy
   */
  ngOnDestroy(): void {
    this.restrictionForm$.unsubscribe();
  }

}
