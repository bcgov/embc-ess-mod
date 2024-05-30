import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileNotesComponent } from './ess-file-notes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('EssFileNotesComponent', () => {
  let component: EssFileNotesComponent;
  let fixture: ComponentFixture<EssFileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EssFileNotesComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
