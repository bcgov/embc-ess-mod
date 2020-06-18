import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './directives/DragDrop.directive';
import { FileUploadComponent } from './components/fileUpload/fileUpload.component';
import { PhoneMaskDirective } from './directives/PhoneMask.directive';
import { GSTCodeDirective } from './directives/GSTCode.directive';
import { ModalComponent } from './components/modal/modal.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './components/toasts/toasts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective,
      ModalComponent,
      CaptchaComponent,
      LoaderComponent,
      AlertComponent,
      ToastsContainer
    ],
  exports: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective,
      CaptchaComponent,
      LoaderComponent,
      AlertComponent,
      ToastsContainer
    ]
})
export class CoreModule { }
