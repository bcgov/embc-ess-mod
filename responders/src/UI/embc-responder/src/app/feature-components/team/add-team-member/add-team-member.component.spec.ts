import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamMemberComponent } from './add-team-member.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddTeamMemberComponent', () => {
  let component: AddTeamMemberComponent;
  let fixture: ComponentFixture<AddTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTeamMemberComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
