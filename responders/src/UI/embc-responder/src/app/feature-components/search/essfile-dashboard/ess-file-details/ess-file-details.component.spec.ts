import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssFileDetailsComponent } from './ess-file-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

describe('EssFileDetailsComponent', () => {
  let component: EssFileDetailsComponent;
  let fixture: ComponentFixture<EssFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CustomPipeModule],
      declarations: [EssFileDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssFileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
