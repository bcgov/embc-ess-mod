import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { EvacuationFileListComponent } from './evacuation-file-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('EvacuationFileListComponent', () => {
  let component: EvacuationFileListComponent;
  let fixture: ComponentFixture<EvacuationFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, MatDialogModule, EvacuationFileListComponent],
      providers: [UntypedFormBuilder, HttpClient, HttpHandler, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuationFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
