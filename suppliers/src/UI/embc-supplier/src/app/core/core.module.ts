import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './directives/DragDrop.directive';
import { FileUploadComponent } from './components/fileUpload/fileUpload.component';
import { PhoneMaskDirective } from './directives/PhoneMask.directive';
import { GSTCodeDirective } from './directives/GSTCode.directive';
import { InvoiceModalContent } from './components/modal/invoiceModal.component';
import { ReceiptModalContent } from './components/modal/receiptModal.component';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective,
      InvoiceModalContent,
      ReceiptModalContent,
      CaptchaComponent
    ],
  exports: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective,
      CaptchaComponent
    ]
})
export class CoreModule { }