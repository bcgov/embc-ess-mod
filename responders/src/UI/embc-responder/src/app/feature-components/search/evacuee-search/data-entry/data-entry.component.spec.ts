import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { MockEvacueeSearchService } from 'src/app/unit-tests/mockEvacueeSearch.service';
import { EvacueeSearchService } from '../evacuee-search.service';

import { DataEntryComponent } from './data-entry.component';

describe('DataEntryComponent', () => {
  let component: DataEntryComponent;
  let fixture: ComponentFixture<DataEntryComponent>;
  let dataEntry: DataEntryComponent;
  let evacueeSearchService;

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
          provide: EvacueeSearchService,
          useClass: MockEvacueeSearchService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryComponent);
    dataEntry = fixture.componentInstance;
    component = TestBed.inject(DataEntryComponent);
    evacueeSearchService = TestBed.inject(EvacueeSearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get paper based true from service', () => {
    evacueeSearchService.paperBased = true;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(true);
  });

  it('should get paper based false from service', () => {
    evacueeSearchService.paperBased = false;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isPaperBased).toEqual(false);
  });

  it('should get paper based true from form', () => {
    evacueeSearchService.paperBased = true;

    fixture.detectChanges();
    component.ngOnInit();

    expect(component.dataEntryForm.get('paperBased').value).toEqual(true);
  });

  it('should get paper based false from form', () => {
    fixture.detectChanges();
    component.ngOnInit();
    component.dataEntryForm.get('paperBased').setValue(false);
    component.next();

    expect(evacueeSearchService.paperBased).toEqual(false);
  });
});
