import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileOverviewComponent } from './ess-file-overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('EssFileOverviewComponent', () => {
  let component: EssFileOverviewComponent;
  let fixture: ComponentFixture<EssFileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, ReactiveFormsModule, EssFileOverviewComponent],
      providers: [
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        { provide: computeInterfaceToken, useValue: {} },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
