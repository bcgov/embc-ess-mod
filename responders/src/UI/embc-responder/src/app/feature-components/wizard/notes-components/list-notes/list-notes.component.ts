import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Note } from 'src/app/core/api/models';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as globalConst from '../../../../core/services/global-constants';
import { StepNotesService } from '../../step-notes/step-notes.service';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrls: ['./list-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListNotesComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() notesList: Array<Note>;
  @Output() hideUnhideToggle = new EventEmitter<Note>();
  @Output() editNoteFlag = new EventEmitter<boolean>(false);
  notes = new MatTableDataSource<Note>();
  notes$: Observable<Array<Note>>;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private userService: UserService,
    private stepNotesService: StepNotesService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.notesList) {
      this.notes = new MatTableDataSource(this.notesList);
      this.notes.paginator = this.paginator;
      this.notes$ = this.notes.connect();
    }
  }

  ngAfterViewInit(): void {
    this.notes.paginator = this.paginator;
    this.cd.detectChanges();
  }

  /**
   * Hides the note from Tier 1 & 2
   *
   * @param noteId id of note to be hidden
   */
  hideNote(noteId: string, noteContent): void {
    const content = globalConst.hideNote;
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content
        },
        width: '580px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          const noteObject: Note = {
            id: noteId,
            isHidden: true,
            content: noteContent
          };
          this.hideUnhideToggle.emit(noteObject);
        }
      });
  }

  /**
   * Shows the note from Tier 1 & 2
   *
   * @param noteId id of note to be shown
   */
  showNote(noteId: string, noteContent): void {
    const content = globalConst.showNote;
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content
        },
        width: '580px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          const noteObject: Note = {
            id: noteId,
            isHidden: false,
            content: noteContent
          };
          this.hideUnhideToggle.emit(noteObject);
        }
      });
  }

  /**
   * Sets the edit flag
   *
   * @param note selected note for editing
   */
  editNote(note: Note): void {
    this.stepNotesService.selectedNote = note;
    this.editNoteFlag.emit(true);
  }

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(
      ClaimType.action,
      ActionPermission[action]
    );
  }
}
