import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Note } from 'src/app/core/api/models';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepNotesService } from '../../step-notes/step-notes.service';
import * as globalConst from 'src/app/core/services/global-constants';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notesList: Array<Note>;
  count: number;
  showLoader = false;
  color = '#169BD5';
  addNoteFlag = false;
  isAddDisabled = false;

  constructor(
    private stepNotesService: StepNotesService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  addNotes(): void {
    this.addNoteFlag = !this.addNoteFlag;
    this.isAddDisabled = !this.isAddDisabled;
  }

  cancel(): void {
    this.loadNotes();
    this.addNoteFlag = !this.addNoteFlag;
    this.isAddDisabled = !this.isAddDisabled;
  }

  private loadNotes(): void {
    this.showLoader = !this.showLoader;
    this.stepNotesService.getNotes().subscribe(
      (notes) => {
        this.showLoader = !this.showLoader;
        let note = notes.sort(
          (a, b) =>
            new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
        );
        this.notesList = note;
        this.count = notes.length;
        this.cd.detectChanges();
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.setAlert('danger', globalConst.notesListError);
      }
    );
  }
}
