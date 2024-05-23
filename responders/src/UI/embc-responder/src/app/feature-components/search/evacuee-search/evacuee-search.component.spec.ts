import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeSearchComponent } from './evacuee-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-search-options',
  template: '',
  standalone: true,
  imports: [HttpClientTestingModule]
})
class SearchOptionsStubComponent {}

describe('EvacueeSearchComponent', () => {
  let component: EvacueeSearchComponent;
  let fixture: ComponentFixture<EvacueeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EvacueeSearchComponent, SearchOptionsStubComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
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
