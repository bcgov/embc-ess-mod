import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';

import { NotesComponent } from './notes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StepNotesService } from '../../step-notes/step-notes.service';
import { MockStepNotesService } from 'src/app/unit-tests/mockStepNotes.service';
import { Component } from '@angular/core';

@Component({ selector: 'app-list-notes', template: '' })
class ListNotesStubComponent {}

@Component({ selector: 'app-add-notes', template: '' })
class AddNotesStubComponent {}

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let stepNotesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [
        NotesComponent,
        ListNotesStubComponent,
        AddNotesStubComponent
      ],
      providers: [{ provide: StepNotesService, useClass: MockStepNotesService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    stepNotesService = TestBed.inject(StepNotesService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load notes', () => {
    fixture.detectChanges();
    component.ngOnInit();
    const notes = [
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
    expect(component.notesList).toEqual(notes);
  });

  it('should display notes list', () => {
    fixture.detectChanges();
    component.ngOnInit();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const listElem = nativeElem.querySelector('app-list-notes');
    expect(listElem).toBeTruthy();
  });

  it('should not display section to add notes by default', () => {
    fixture.detectChanges();
    component.ngOnInit();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const addElem = nativeElem.querySelector('app-add-notes');
    expect(addElem).toBeFalsy();
  });

  it('should display section to add notes when Add Notes is called', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    component.addNotes();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const addElem = nativeElem.querySelector('app-add-notes');
    expect(addElem).toBeTruthy();
  }));

  it('should close the add notes section when Cancel is called', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    component.addNotes();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    component.cancel();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const addElem = nativeElem.querySelector('app-add-notes');
    expect(addElem).toBeFalsy();
  }));

  it('should hide the note when Hide function is called', fakeAsync(() => {
    const noteToHide = {
      addedOn: '2022-09-08T22:25:23Z',
      content: 'test',
      creatingTeamMemberId: '86deef16-d5c4-ec11-b832-00505683fbf4',
      id: 'f006c1f3-69a6-45da-a396-413209cf241e',
      isEditable: true,
      isHidden: false,
      memberName: 'Test S.',
      teamName: 'DEV Team'
    };

    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    component.hideUnhideNotes(noteToHide);

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    expect(component.notesList[0].isHidden).toEqual(true);
  }));
});
