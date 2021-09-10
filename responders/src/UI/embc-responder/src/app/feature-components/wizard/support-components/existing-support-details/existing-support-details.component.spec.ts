import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingSupportDetailsComponent } from './existing-support-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

describe('ExistingSupportDetailsComponent', () => {
  let component: ExistingSupportDetailsComponent;
  let fixture: ComponentFixture<ExistingSupportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        CustomPipeModule
      ],
      declarations: [ExistingSupportDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingSupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
