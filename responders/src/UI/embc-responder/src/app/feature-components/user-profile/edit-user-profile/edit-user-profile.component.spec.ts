import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { EditUserProfileComponent } from './edit-user-profile.component';
import { provideRouter } from '@angular/router';

describe('EditUserProfileComponent', () => {
  let component: EditUserProfileComponent;
  let fixture: ComponentFixture<EditUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, EditUserProfileComponent],
      providers: [UntypedFormBuilder, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
