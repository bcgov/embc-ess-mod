import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import SecretComponent from './secret.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('SecretComponent', () => {
  let component: SecretComponent;
  let fixture: ComponentFixture<SecretComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormCreationService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
