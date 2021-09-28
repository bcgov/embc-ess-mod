import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-process-supports-dialog',
  templateUrl: './process-supports-dialog.component.html',
  styleUrls: ['./process-supports-dialog.component.scss']
})
export class ProcessSupportsDialogComponent implements OnInit {
  @Output() outputEvent = new EventEmitter<boolean>();
  addEvacForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createAddEvacueeSummForm();
  }

  confirm(): void {
    if (this.addEvacForm.get('addSummary').value === undefined) {
      this.outputEvent.emit(false);
    } else {
      this.outputEvent.emit(this.addEvacForm.get('addSummary').value);
    }
  }

  cancel(): void {
    // this.outputEvent.emit('cancel');
  }

  private createAddEvacueeSummForm(): void {
    this.addEvacForm = this.formBuilder.group({
      addSummary: ['']
    });
  }
}
