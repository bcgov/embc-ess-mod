import { Component, OnInit } from '@angular/core';
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
  showLoader = true;
  public color = '#169BD5';

  constructor(
    private stepNotesService: StepNotesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.stepNotesService.getNotes().subscribe(
      (notes) => {
        this.showLoader = !this.showLoader;
        this.notesList = notes;
        this.count = notes.length;
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.setAlert('danger', globalConst.notesListError);
      }
    );
  }
}
