import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Note, RegistrationResult } from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';
import { TabModel } from 'src/app/core/models/tab.model';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({ providedIn: 'root' })
export class StepNotesService {
  private notesTabVal: Array<TabModel>;
  private selectedNoteVal: Note;

  constructor(
    private registrationsService: RegistrationsService,
    private evacueeSessionService: EvacueeSessionService,
    private userService: UserService
  ) {}

  public get notesTab(): Array<TabModel> {
    return this.notesTabVal;
  }
  public set notesTab(notesTab: Array<TabModel>) {
    this.notesTabVal = notesTab;
  }

  public get selectedNote(): Note {
    return this.selectedNoteVal;
  }

  public set selectedNote(selectedNoteVal: Note) {
    this.selectedNoteVal = selectedNoteVal;
  }

  /**
   * Maps notes from evacuation file
   *
   * @returns observable array of notes
   */
  public getNotes(): Observable<Array<Note>> {
    return this.registrationsService
      .registrationsGetFile({
        fileId: this.evacueeSessionService.essFileNumber
      })
      .pipe(
        map((file) => {
          if (this.hasPermission('canSeeHiddenNotes')) {
            return file.notes;
          } else {
            return file.notes.filter((note) => !note.isHidden);
          }
        })
      );
  }

  /**
   * Creates the note DTO
   *
   * @param content User entered note content
   * @returns Note object
   */
  createNoteDTO(content: string, id?: string): Note {
    return {
      id,
      content
    };
  }

  /**
   * Save user entered notes for the file
   *
   * @param note user entered note
   * @returns
   */
  public saveNotes(note: Note): Observable<RegistrationResult> {
    return this.registrationsService.registrationsCreateFileNote({
      fileId: this.evacueeSessionService.essFileNumber,
      body: note
    });
  }

  /**
   * Makes the note visible or not
   *
   * @param noteId id of note
   * @param isHidden flag if the note is visible or not
   * @returns array of updated notes
   */
  public hideUnhideNotes(
    noteId: string,
    isHidden: boolean
  ): Observable<Array<Note>> {
    return this.registrationsService
      .registrationsSetFileNoteHiddenStatus({
        fileId: this.evacueeSessionService.essFileNumber,
        noteId,
        isHidden
      })
      .pipe(
        mergeMap((result) => {
          return this.getNotes();
        })
      );
  }

  /**
   * Updates the note
   *
   * @param note note to be edited
   * @returns id of the updated note
   */
  public editNote(note: Note): Observable<RegistrationResult> {
    return this.registrationsService.registrationsUpdateFileNoteContent({
      fileId: this.evacueeSessionService.essFileNumber,
      noteId: note.id,
      body: note
    });
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
