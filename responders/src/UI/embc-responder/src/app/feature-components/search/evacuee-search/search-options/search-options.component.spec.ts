import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computeInterfaceToken } from 'src/app/app.module';
import { UserService } from 'src/app/core/services/user.service';

import { SearchOptionsComponent } from './search-options.component';

describe('SearchOptionsComponent', () => {
  let component: SearchOptionsComponent;
  let fixture: ComponentFixture<SearchOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SearchOptionsComponent],
      providers: [{ provide: computeInterfaceToken, useValue: {} }, UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
