import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { RestrictionService } from './restriction.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit, OnDestroy {

  restrictionForm: FormGroup;
  restrictionForm$: Subscription;
  currentFlow: string;

  constructor(private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private formCreationService: FormCreationService,
    public restrictionService: RestrictionService) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.restrictionForm$ = this.formCreationService.getRestrictionForm().subscribe(
      restrictionForm => {
        this.restrictionForm = restrictionForm;
      }
    );
  }

  mapData(): void {
    const existingValues = this.dataService.getRegistration();
    if (existingValues !== null) {
      this.restrictionForm.get('restrictedAccess').setValue(existingValues.restrictedAccess);
    }
  }

  submitRestriction(): void {
    if (this.restrictionForm.status === 'VALID') {
      this.restrictionService.restrictedAccess = this.restrictionForm.get('restrictedAccess').value;
      const navigationPath = '/' + this.currentFlow + '/create-profile';
      this.router.navigate([navigationPath]);
    } else {
      this.restrictionForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.restrictionForm$.unsubscribe();
  }

}
