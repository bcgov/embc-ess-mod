import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import FamilyInformationComponent from './family-information.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('FamilyInformationComponent', () => {
  let component: FamilyInformationComponent;
  let fixture: ComponentFixture<FamilyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyInformationComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
