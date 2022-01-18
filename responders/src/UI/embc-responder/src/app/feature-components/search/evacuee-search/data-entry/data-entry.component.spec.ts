import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MaterialModule } from 'src/app/material.module';
import { MockEvacueeSessionService } from 'src/app/unit-tests/mockEvacueeSession.service';

import { DataEntryComponent } from './data-entry.component';

describe('DataEntryComponent', () => {
  let component: DataEntryComponent;
  let fixture: ComponentFixture<DataEntryComponent>;
  let dataEntry: DataEntryComponent;
  let evacueeSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      declarations: [DataEntryComponent],
      providers: [
        FormBuilder,
        DataEntryComponent,
        {
          provide: EvacueeSessionService,
          useClass: MockEvacueeSessionService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryComponent);
    dataEntry = fixture.componentInstance;
    component = TestBed.inject(DataEntryComponent);
    evacueeSessionService = TestBed.inject(EvacueeSessionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get paper based true from service', () => {
    evacueeSessionService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(true);
  });

  it('should get paper based false from service', () => {
    evacueeSessionService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(false);
  });

  it('should get paper based true from form', () => {
    evacueeSessionService.paperBased = true;

    fixture.detectChanges();
    component.ngOnInit();

    expect(component.dataEntryForm.get('paperBased').value).toEqual(true);
  });

  it('should get paper based false from form', () => {
    fixture.detectChanges();
    component.ngOnInit();
    component.dataEntryForm.get('paperBased').setValue(false);
    component.next();

    expect(evacueeSessionService.paperBased).toEqual(false);
  });
});
