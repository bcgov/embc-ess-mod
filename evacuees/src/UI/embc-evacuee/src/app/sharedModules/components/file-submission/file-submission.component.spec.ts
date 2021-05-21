import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileSubmissionComponent } from './file-submission.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileSubmissionComponent', () => {
  let component: FileSubmissionComponent;
  let fixture: ComponentFixture<FileSubmissionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FileSubmissionComponent],
        imports: [RouterTestingModule, HttpClientTestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
