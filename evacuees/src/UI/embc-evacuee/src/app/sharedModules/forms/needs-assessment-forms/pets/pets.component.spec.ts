import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import PetsComponent from './pets.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';

describe('PetsComponent', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetsComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormCreationService, FormBuilder ]
    })
    .compileComponents();
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
