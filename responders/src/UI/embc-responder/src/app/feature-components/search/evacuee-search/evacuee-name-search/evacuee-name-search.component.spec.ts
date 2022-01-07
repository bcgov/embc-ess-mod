import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { EvacueeNameSearchComponent } from './evacuee-name-search.component';

describe('EvacueeNameSearchComponent', () => {
  let component: EvacueeNameSearchComponent;
  let fixture: ComponentFixture<EvacueeNameSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeNameSearchComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeNameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
