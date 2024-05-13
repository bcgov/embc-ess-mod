import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNoticeComponent } from './collection-notice.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { provideRouter } from '@angular/router';

describe('CollectionNoticeComponent', () => {
  let component: CollectionNoticeComponent;
  let fixture: ComponentFixture<CollectionNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, CollectionNoticeComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }, provideRouter([])]
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
