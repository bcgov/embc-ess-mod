import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss']
})
export class AddNotesComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();
  notesForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createNotesForm();
  }

  private createNotesForm(): void {
    this.notesForm = this.formBuilder.group({
      note: ['']
    })
  }

  cancel(): void {
    this.cancelEvent.emit(true);
  }

  save(): void {

  }

}
