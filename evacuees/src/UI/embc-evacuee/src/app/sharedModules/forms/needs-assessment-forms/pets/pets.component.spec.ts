import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import PetsComponent from './pets.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';

describe('PetsComponent', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PetsComponent],
        imports: [ReactiveFormsModule],
        providers: [FormCreationService, FormBuilder],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
