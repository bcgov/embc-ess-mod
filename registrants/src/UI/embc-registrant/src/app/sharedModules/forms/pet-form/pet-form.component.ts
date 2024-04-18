import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule]
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
    return this.petForm.controls;
  }
}
