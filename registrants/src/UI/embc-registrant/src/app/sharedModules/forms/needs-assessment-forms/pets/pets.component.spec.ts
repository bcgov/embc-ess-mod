import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import PetsComponent from './pets.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';

describe('PetsComponent', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PetsComponent],
      imports: [ReactiveFormsModule],
      providers: [FormCreationService, UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
