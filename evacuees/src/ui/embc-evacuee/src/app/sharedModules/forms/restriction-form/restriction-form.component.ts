import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-restriction-form',
  templateUrl: './restriction-form.component.html',
  styleUrls: ['./restriction-form.component.scss']
})
export class RestrictionFormComponent implements OnInit {

  @Input() restrictionForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Returns the control of the form
   */
  get restrFormControl(): { [key: string]: AbstractControl; } {
    return this.restrictionForm.controls;
  }

}
