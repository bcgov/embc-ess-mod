import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EditUserProfileComponent } from './edit-user-profile.component';

describe('EditUserProfileComponent', () => {
  let component: EditUserProfileComponent;
  let fixture: ComponentFixture<EditUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserProfileComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [UntypedFormBuilder]
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
