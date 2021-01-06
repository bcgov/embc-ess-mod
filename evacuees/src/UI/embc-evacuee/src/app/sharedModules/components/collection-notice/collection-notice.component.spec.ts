import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNoticeComponent } from './collection-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../core/services/data.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('CollectionNoticeComponent', () => {
  let component: CollectionNoticeComponent;
  let fixture: ComponentFixture<CollectionNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionNoticeComponent ],
      imports: [ RouterTestingModule, ReactiveFormsModule ],
      providers: [MatDialog, DataService, FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
