import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MaterialModule } from 'src/app/material.module';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';

import { EssfileSecurityPhraseComponent } from './essfile-security-phrase.component';

describe('EssfileSecurityPhraseComponent', () => {
  let component: EssfileSecurityPhraseComponent;
  let fixture: ComponentFixture<EssfileSecurityPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EssfileSecurityPhraseComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssfileSecurityPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
