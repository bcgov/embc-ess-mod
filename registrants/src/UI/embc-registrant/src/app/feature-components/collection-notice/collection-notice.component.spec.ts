import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';

import { CollectionNoticeComponent } from './collection-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule, MatCheckbox } from '@angular/material/checkbox';
import { CoreModule } from '../../core/core.module';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('CollectionNoticeComponent', () => {
  let component: CollectionNoticeComponent;
  let fixture: ComponentFixture<CollectionNoticeComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionNoticeComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        MatDialogModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        CoreModule
      ],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNoticeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method on button click', fakeAsync(() => {
    spyOn(component, 'submitNotice');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    tick();
    expect(component.submitNotice).toHaveBeenCalled();
  }));

  // it('should open dialog box when collection notice not agreed', fakeAsync(() => {
  //   spyOn(component.dialog, 'open').and.callThrough();
  //   component.submitNotice();

  //   tick();
  //   expect(component.dialog.open).toHaveBeenCalledWith(DialogComponent, {
  //     data: globalConst.noticeBody,
  //     height: '220px',
  //     width: '500px'
  //   });

  // }));

  // it('should navigate to next page when collection notice agreed', waitForAsync(() => {
  //   spyOn(router, 'navigate');

  //   // let checkbox = fixture.debugElement.query(By.css('.mat-checkbox'));
  //   // console.log(checkbox)
  //   // checkbox.componentInstance.isChecked = true;
  //   let checkboxDebugElement = fixture.debugElement.query(By.directive(MatCheckbox))!;
  //   console.log(checkboxDebugElement)
  //   let  checkboxNativeElement = checkboxDebugElement.nativeElement;
  //   console.log(checkboxNativeElement)
  //   let  checkboxInstance = checkboxDebugElement.componentInstance;
  //   checkboxInstance.checked = true;
  //   console.log(checkboxInstance)
  //   let testComponent = fixture.debugElement.componentInstance;
  //   console.log(testComponent)
  //   testComponent.isChecked = true;
  //   fixture.detectChanges()
  //   //let tst = checkbox.triggerEventHandler('click', {})
  //   //console.log(tst)
  //   console.log(component.collectionForm)
  //   console.log(component.collectionForm.get('informationCollectionConsent').value)
  //   fixture.whenStable().then(() => {
  //     //expect(component.collectionForm.get('informationCollectionConsent').value).toBe(true);
  //     expect(router.navigate).toHaveBeenCalledWith(['/non-verified-registration/restriction'])
  //   })
  //   //expect(router.navigate).toHaveBeenCalledWith(['/non-verified-registration/restriction'])
  // }));
});
