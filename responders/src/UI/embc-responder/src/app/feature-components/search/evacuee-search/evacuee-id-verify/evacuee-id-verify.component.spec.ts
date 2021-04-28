import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

describe('EvacueeIdVerifyComponent', () => {
  let component: EvacueeIdVerifyComponent;
  let fixture: ComponentFixture<EvacueeIdVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeIdVerifyComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeIdVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
