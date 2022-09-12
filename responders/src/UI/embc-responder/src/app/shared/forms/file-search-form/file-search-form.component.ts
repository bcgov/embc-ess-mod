import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-search-form',
  templateUrl: './file-search-form.component.html',
  styleUrls: ['./file-search-form.component.scss']
})
export class FileSearchFormComponent implements OnInit {
  @Input() fileSearchForm: FormGroup<{ essFileNumber: FormControl<string> }>;

  constructor() {}

  get fileSearchFormControl(): { [key: string]: AbstractControl } {
    return this.fileSearchForm?.controls;
  }

  ngOnInit(): void {}
}
