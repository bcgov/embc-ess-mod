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
import { ToastsComponent } from './components/toasts/toasts.component';
import { DecimalCurrencyDirective } from './directives/DecimalCurrency.directive';
import { WarningModalComponent } from './components/warningModal/warningModal.component';
import { BannerComponent } from './components/banner/banner.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [CommonModule, FormsModule, MatDialogModule, NgbModule],
  declarations: [
    AlertComponent,
    BannerComponent,
    CaptchaComponent,
    DecimalCurrencyDirective,
    DragDropDirective,
    FileUploadComponent,
    GSTCodeDirective,
    LoaderComponent,
    ModalComponent,
    PhoneMaskDirective,
    ToastsComponent,
    WarningModalComponent
  ],
  exports: [
    AlertComponent,
    BannerComponent,
    CaptchaComponent,
    DecimalCurrencyDirective,
    DragDropDirective,
    FileUploadComponent,
    GSTCodeDirective,
    LoaderComponent,
    MatDialogModule,
    PhoneMaskDirective,
    ToastsComponent
  ]
})
export class CoreModule {}
