import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileNotesComponent } from './ess-file-notes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EssFileNotesComponent', () => {
  let component: EssFileNotesComponent;
  let fixture: ComponentFixture<EssFileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [EssFileNotesComponent]
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
