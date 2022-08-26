import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchComponent } from './evacuee-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { Component } from '@angular/core';

@Component({ selector: 'app-search-options', template: '' })
class SearchOptionsStubComponent {}

describe('EvacueeSearchComponent', () => {
  let component: EvacueeSearchComponent;
  let fixture: ComponentFixture<EvacueeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacueeSearchComponent, SearchOptionsStubComponent],
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

  it('should display child component for search options', () => {
    fixture.detectChanges();
    component.ngOnInit();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const optionsElem = nativeElem.querySelector('app-search-options');
    expect(optionsElem).toBeDefined();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
