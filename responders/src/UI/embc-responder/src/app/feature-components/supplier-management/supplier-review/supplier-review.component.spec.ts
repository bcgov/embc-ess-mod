import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

import { SupplierReviewComponent } from './supplier-review.component';
import { provideRouter } from '@angular/router';

describe('SupplierReviewComponent', () => {
  let component: SupplierReviewComponent;
  let fixture: ComponentFixture<SupplierReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        CustomPipeModule,
        SupplierReviewComponent
      ],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
