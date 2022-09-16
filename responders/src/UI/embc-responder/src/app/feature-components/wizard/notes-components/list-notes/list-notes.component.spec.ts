import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';

import { ListNotesComponent } from './list-notes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StepNotesService } from '../../step-notes/step-notes.service';
import { MockStepNotesService } from 'src/app/unit-tests/mockStepNotes.service';
import { UserService } from 'src/app/core/services/user.service';
import { MockUserService } from 'src/app/unit-tests/mockUser.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListNotesComponent', () => {
  let component: ListNotesComponent;
  let fixture: ComponentFixture<ListNotesComponent>;
  let stepNotesService;
  let userService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ListNotesComponent],
      providers: [
        { provide: StepNotesService, useClass: MockStepNotesService },
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotesComponent);
    component = fixture.componentInstance;
    stepNotesService = TestBed.inject(StepNotesService);
    userService = TestBed.inject(UserService);
    component.notesList = stepNotesService.noteList;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open hide note popup ', fakeAsync(() => {
    fixture.detectChanges();
    component.hideNote('f006c1f3-69a6-45da-a396-413209cf241e', 'test');

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;

    expect(dialogContent).toBeDefined();
  }));

  it('should open show note popup ', fakeAsync(() => {
    fixture.detectChanges();
    component.showNote('f006c1f3-69a6-45da-a396-413209cf241e', 'test');

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    const dialogContent = document.getElementsByTagName(
      'app-information-dialog'
    )[0] as HTMLElement;

    expect(dialogContent).toBeDefined();
  }));
});
