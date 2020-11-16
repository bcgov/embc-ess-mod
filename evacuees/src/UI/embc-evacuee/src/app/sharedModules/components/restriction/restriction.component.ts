import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit {

  restrictionForm: FormGroup;
  currentFlow: string;

  constructor(private router: Router, private builder: FormBuilder, private dataService: DataService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.restrictionForm = this.builder.group({
      restrictedAccess: [false, [Validators.required]]
    });

    this.mapData();
  }

  /**
   * Returns the control of the form
   */
  get restrFormControl(): { [key: string]: AbstractControl; } {
    return this.restrictionForm.controls;
  }

  mapData(): void {
    const existingValues = this.dataService.getRegistration();
    if (existingValues !== null) {
      this.restrictionForm.get('restrictedAccess').setValue(existingValues.restrictedAccess);
    }
  }

  submitRestriction(): void {
    if (this.restrictionForm.status === 'VALID') {
      this.dataService.updateRegistartion(this.restrictionForm.value);
      let navigationPath = '/' + this.currentFlow + '/create-profile'
      this.router.navigate([navigationPath]);
    } else {
      this.restrictionForm.markAllAsTouched();
    }
  }

}
