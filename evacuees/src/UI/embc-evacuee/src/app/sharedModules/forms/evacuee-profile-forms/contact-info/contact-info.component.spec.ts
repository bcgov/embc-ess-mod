import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import ContactInfoComponent from './contact-info.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfoComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormCreationService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
