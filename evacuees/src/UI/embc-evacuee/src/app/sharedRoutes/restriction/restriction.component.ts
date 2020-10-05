import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { setClassMetadata } from '@angular/core/src/r3_symbols';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit {

  restrictionForm: FormGroup;

  constructor(private router: Router, private builder: FormBuilder, private dataService: DataService ) { }

  ngOnInit(): void {
    this.restrictionForm = this.builder.group({
      restrictedAccess: ['', [Validators.required]]
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
      this.router.navigate(['/non-verified-registration/create-profile']);
    } else {
      this.restrictionForm.markAllAsTouched();
    }
  }

}
