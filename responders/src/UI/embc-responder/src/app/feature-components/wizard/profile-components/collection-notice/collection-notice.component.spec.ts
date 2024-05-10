import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNoticeComponent } from './collection-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';

describe('CollectionNoticeComponent', () => {
  let component: CollectionNoticeComponent;
  let fixture: ComponentFixture<CollectionNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule],
      declarations: [CollectionNoticeComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
