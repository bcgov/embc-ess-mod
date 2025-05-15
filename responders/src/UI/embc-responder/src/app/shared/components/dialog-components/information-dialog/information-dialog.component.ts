import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { MatButton } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import * as globalConst from '../../../../core/services/global-constants';
import { StepNotesService } from '../../../../feature-components/wizard/step-notes/step-notes.service';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
  standalone: true,
  imports: [MatButton, MatCheckboxModule, FormsModule]
})
export class InformationDialogComponent {
  @Input() content: DialogContent;
  @Output() outputEvent = new EventEmitter<string>();
  isCheckboxChecked: boolean = false;
  notesForm: any;
  isImportantNote: any;
  closeEvent: any;
  showLoader: boolean;
  isSubmitted: boolean;
  alertService: any;

  constructor(private stepNotesService: StepNotesService) {}

  cancel(): void {
    this.outputEvent.emit('cancel');
  }

  confirm(confirmCheckbox: string | null): void {
    if (confirmCheckbox == globalConst.confirmDuplicateSupportMessage) {
      this.createNote(confirmCheckbox);
    }
    this.outputEvent.emit('confirm');
  }

  exit(): void {
    this.outputEvent.emit('exit');
  }

  createNote(confirmCheckbox: string | null): void {
    this.stepNotesService
      .saveNotes(
        this.stepNotesService.createNoteDTO({
          note: confirmCheckbox,
          id: undefined,
          isImportant: true
        })
      )
      .subscribe({
        next: (result) => {
          // success
        },
        error: (error) => {
          // error
        }
      });
  }
}
