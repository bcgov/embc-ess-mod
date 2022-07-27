import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssfileDashboardComponent } from './essfile-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('EssfileDashboardComponent', () => {
  let component: EssfileDashboardComponent;
  let fixture: ComponentFixture<EssfileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [EssfileDashboardComponent],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
