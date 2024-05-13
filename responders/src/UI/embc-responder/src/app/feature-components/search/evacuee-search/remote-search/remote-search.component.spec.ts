import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { OptionInjectionService } from 'src/app/core/interfaces/searchOptions.service';
import { MockOptionInjectionService } from 'src/app/unit-tests/mockOptionInjection.service';

import { RemoteSearchComponent } from './remote-search.component';
import { provideRouter } from '@angular/router';

describe('RemoteSearchComponent', () => {
  let component: RemoteSearchComponent;
  let fixture: ComponentFixture<RemoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RemoteSearchComponent],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: OptionInjectionService,
          useClass: MockOptionInjectionService
        },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
