import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { StepCreateEssFileService } from '../../step-create-ess-file/step-create-ess-file.service';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.component.html',
  styleUrls: ['./needs.component.scss']
})
export class NeedsComponent implements OnInit {
  needsForm: FormGroup;

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createNeedsForm();
  }

  get needsFormControl(): { [key: string]: AbstractControl } {
    return this.needsForm.controls;
  }

  back(): void {
    this.router.navigate(['/ess-wizard/create-ess-file/animals']);
  }

  next(): void {
    // this.stepCreateEssFileService.nextTabUpdate.next();
    this.router.navigate(['/ess-wizard/create-ess-file/security-phrase']);
  }

  private createNeedsForm(): void {
    this.needsForm = this.formBuilder.group({
      canEvacueeProvideFood: [
        this.stepCreateEssFileService.canEvacueeProvideFooD ?? '',
        Validators.required
      ],
      canEvacueeProvideLodging: [
        this.stepCreateEssFileService.canEvacueeProvideLodginG ?? '',
        Validators.required
      ],
      canEvacueeProvideClothing: [
        this.stepCreateEssFileService.canEvacueeProvideClothinG ?? '',
        Validators.required
      ],
      canEvacueeProvideTransportation: [
        this.stepCreateEssFileService.canEvacueeProvideTransportatioN ?? '',
        Validators.required
      ],
      canEvacueeProvideIncidentals: [
        this.stepCreateEssFileService.canEvacueeProvideIncidentalS ?? '',
        Validators.required
      ]
    });
  }
}
