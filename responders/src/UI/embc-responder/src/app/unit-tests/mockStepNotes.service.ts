import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../core/api/models';
import { StepNotesService } from '../feature-components/wizard/step-notes/step-notes.service';

@Injectable({
  providedIn: 'root'
})
export class MockStepNotesService extends StepNotesService {
  noteList: Array<Note> = [
    {
      addedOn: '2022-09-08T22:25:23Z',
      content: 'test',
      creatingTeamMemberId: '86deef16-d5c4-ec11-b832-00505683fbf4',
      id: 'f006c1f3-69a6-45da-a396-413209cf241e',
      isEditable: true,
      isHidden: false,
      memberName: 'Test S.',
      teamName: 'DEV Team'
    },
    {
      addedOn: '2022-09-07T18:53:41Z',
      content: 'Test notes for notes pathway-edit',
      creatingTeamMemberId: '86deef16-d5c4-ec11-b832-00505683fbf4',
      id: '37ad9d27-63ed-4de5-a146-4dc7f8dd36e7',
      isEditable: false,
      isHidden: false,
      memberName: 'Test S.',
      teamName: 'DEV Team'
    }
  ];

  hiddenNoteList: Array<Note> = [
    {
      addedOn: '2022-09-08T22:25:23Z',
      content: 'test',
      creatingTeamMemberId: '86deef16-d5c4-ec11-b832-00505683fbf4',
      id: 'f006c1f3-69a6-45da-a396-413209cf241e',
      isEditable: true,
      isHidden: true,
      memberName: 'Test S.',
      teamName: 'DEV Team'
    },
    {
      addedOn: '2022-09-07T18:53:41Z',
      content: 'Test notes for notes pathway-edit',
      creatingTeamMemberId: '86deef16-d5c4-ec11-b832-00505683fbf4',
      id: '37ad9d27-63ed-4de5-a146-4dc7f8dd36e7',
      isEditable: false,
      isHidden: false,
      memberName: 'Test S.',
      teamName: 'DEV Team'
    }
  ];

  public getNotes(): Observable<Array<Note>> {
    return new BehaviorSubject<Array<Note>>(this.noteList);
  }

  public hideUnhideNotes(
    noteId: string,
    isHidden: boolean
  ): Observable<Array<Note>> {
    return new BehaviorSubject<Array<Note>>(this.hiddenNoteList);
  }
}
