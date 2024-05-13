import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReviewComponent } from './profile-review.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { computeInterfaceToken } from 'src/app/app.module';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';

describe('ProfileReviewComponent', () => {
  let component: ProfileReviewComponent;
  let fixture: ComponentFixture<ProfileReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        CustomPipeModule,
        ProfileReviewComponent
      ],
      providers: [
        UntypedFormBuilder,
        DatePipe,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
