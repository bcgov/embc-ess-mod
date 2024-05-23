import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-file-search-form',
  templateUrl: './file-search-form.component.html',
  styleUrls: ['./file-search-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError]
})
export class FileSearchFormComponent {
  @Input() fileSearchForm: FormGroup<{ essFileNumber: FormControl<string> }>;

  get fileSearchFormControl(): { [key: string]: AbstractControl } {
    return this.fileSearchForm?.controls;
  }
}
