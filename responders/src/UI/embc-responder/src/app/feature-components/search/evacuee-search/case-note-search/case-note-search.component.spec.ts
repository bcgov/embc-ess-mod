import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';

import { CaseNoteSearchComponent } from './case-note-search.component';

describe('CaseNoteSearchComponent', () => {
  let component: CaseNoteSearchComponent;
  let fixture: ComponentFixture<CaseNoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [CaseNoteSearchComponent],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaseNoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
