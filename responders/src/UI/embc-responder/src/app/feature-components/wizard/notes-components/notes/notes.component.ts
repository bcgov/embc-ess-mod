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

  /**
   * Toggle for add notes button
   */
  addNotes(): void {
    this.addNoteFlag = !this.addNoteFlag;
    this.isAddDisabled = !this.isAddDisabled;
  }

  /**
   * On Cancel, reloads the notes list and toggles
   * flags
   */
  cancel(): void {
    this.loadNotes();
    this.addNoteFlag = !this.addNoteFlag;
    this.isAddDisabled = !this.isAddDisabled;
    this.stepNotesService.selectedNote = undefined;
  }

  /**
   * Hides/shows the note on user action
   *
   * @param note Note to hide/show
   */
  hideUnhideNotes(note: Note): void {
    this.showLoader = !this.showLoader;
    this.stepNotesService.hideUnhideNotes(note.id, note.isHidden).subscribe({
      next: (notes) => {
        this.showLoader = !this.showLoader;
        const sortedNotes = notes.sort(
          (a, b) =>
            new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
        );
        this.notesList = sortedNotes;
        this.count = notes.length;
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        if (note.isHidden) {
          this.alertService.setAlert('danger', globalConst.hideNoteError);
        } else {
          this.alertService.setAlert('danger', globalConst.showNoteError);
        }
      }
    });
  }

  /**
   * Sets the edit view
   *
   * @param allowEdit true/false flag
   */
  editNote(allowEdit: boolean) {
    if (allowEdit) {
      this.addNoteFlag = !this.addNoteFlag;
      this.isAddDisabled = !this.isAddDisabled;
    }
  }

  /**
   * Loads and sorts the notes
   */
  private loadNotes(): void {
    this.showLoader = !this.showLoader;
    this.stepNotesService.getNotes().subscribe({
      next: (notes) => {
        this.showLoader = !this.showLoader;
        const note = notes.sort(
          (a, b) =>
            new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf()
        );
        this.notesList = note;
        this.count = notes.length;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.notesListError);
      }
    });
  }
}
