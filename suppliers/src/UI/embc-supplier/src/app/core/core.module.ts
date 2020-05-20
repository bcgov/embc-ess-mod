import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './directives/DragDrop.directive';
import { FileUploadComponent } from './components/fileUpload/fileUpload.component';
import { PhoneMaskDirective } from './directives/PhoneMask.directive';
import { GSTCodeDirective } from './directives/GSTCode.directive';
import { InvoiceModalContent } from './components/modal/invoiceModal.component';
import { ReceiptModalContent } from './components/modal/receiptModal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective,
      InvoiceModalContent,
      ReceiptModalContent
    ],
  exports: [
      DragDropDirective,
      FileUploadComponent,
      PhoneMaskDirective,
      GSTCodeDirective
    ]
})
export class CoreModule { }