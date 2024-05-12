import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
    selector: 'app-file-search-form',
    templateUrl: './file-search-form.component.html',
    styleUrls: ['./file-search-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError]
})
export class FileSearchFormComponent implements OnInit {
  @Input() fileSearchForm: FormGroup<{ essFileNumber: FormControl<string> }>;

  constructor() {}

  get fileSearchFormControl(): { [key: string]: AbstractControl } {
    return this.fileSearchForm?.controls;
  }

  ngOnInit(): void {}
}
