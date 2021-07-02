import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesComponent } from './add-notes.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('AddNotesComponent', () => {
  let component: AddNotesComponent;
  let fixture: ComponentFixture<AddNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      declarations: [AddNotesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
