import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EvacuationDetailsComponent } from './evacuation-details.component';

describe('EvacuationDetailsComponent', () => {
  let component: EvacuationDetailsComponent;
  let fixture: ComponentFixture<EvacuationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacuationDetailsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
