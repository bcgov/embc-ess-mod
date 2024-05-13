import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { computeInterfaceToken } from 'src/app/app.module';

import { PossibleMatchedEssfilesComponent } from './possible-matched-essfiles.component';
import { provideRouter } from '@angular/router';

describe('PossibleMatchedEssfilesComponent', () => {
  let component: PossibleMatchedEssfilesComponent;
  let fixture: ComponentFixture<PossibleMatchedEssfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, PossibleMatchedEssfilesComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PossibleMatchedEssfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
