import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-gst-field',
  templateUrl: './custom-gst-field.component.html',
  styleUrls: ['./custom-gst-field.component.scss']
})
export class CustomGstFieldComponent implements OnInit {
  @Input() gstFormGroup: UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {}

  get gstFormControl(): { [key: string]: AbstractControl } {
    return this.gstFormGroup.controls;
  }
}
