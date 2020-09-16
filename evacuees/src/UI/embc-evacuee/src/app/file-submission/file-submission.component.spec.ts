import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSubmissionComponent } from './file-submission.component';

describe('FileSubmissionComponent', () => {
  let component: FileSubmissionComponent;
  let fixture: ComponentFixture<FileSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
