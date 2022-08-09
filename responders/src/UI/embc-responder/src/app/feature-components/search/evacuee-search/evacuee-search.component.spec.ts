import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchComponent } from './evacuee-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';

describe('EvacueeSearchComponent', () => {
  let component: EvacueeSearchComponent;
  let fixture: ComponentFixture<EvacueeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: computeInterfaceToken, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
