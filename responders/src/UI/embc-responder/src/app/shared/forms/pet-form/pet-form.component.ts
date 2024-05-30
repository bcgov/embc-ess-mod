import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError]
})
export class PetFormComponent implements OnInit {
  @Input() petForm: UntypedFormGroup;
  howMany: Array<string> = new Array<string>();

  constructor() {}

  ngOnInit(): void {
    this.howMany = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'More than 10'];
  }

  /**
   * Returns the control of the form
   */
  get petFormControl(): { [key: string]: AbstractControl } {
    return this.petForm?.controls;
  }
}
