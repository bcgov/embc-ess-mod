import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroFileResultComponent } from './zero-file-result.component';

describe('ZeroFileResultComponent', () => {
  let component: ZeroFileResultComponent;
  let fixture: ComponentFixture<ZeroFileResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZeroFileResultComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroFileResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
