import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from 'src/app/core/services/dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { EvacuationFileListComponent } from './evacuation-file-list.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('EvacuationFileListComponent', () => {
  let component: EvacuationFileListComponent;
  let fixture: ComponentFixture<EvacuationFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvacuationFileListComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [FormBuilder, DialogService, HttpClient, HttpHandler],
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
