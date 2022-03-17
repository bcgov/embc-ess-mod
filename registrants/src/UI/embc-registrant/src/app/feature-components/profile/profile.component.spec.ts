import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [ComponentCreationService, FormCreationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
