import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSupportsComponent } from './step-supports.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('StepSupportsComponent', () => {
  let component: StepSupportsComponent;
  let fixture: ComponentFixture<StepSupportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      declarations: [StepSupportsComponent],
      providers: [UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSupportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
