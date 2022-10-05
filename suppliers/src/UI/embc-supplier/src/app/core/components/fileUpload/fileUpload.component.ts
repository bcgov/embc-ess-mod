import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { WarningService } from 'src/app/core/services/warning.service';
import * as constant from 'src/app/core/services/globalConstants';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output() attachedFile = new EventEmitter<any>();
  @Output() deleteFile = new EventEmitter<any>();
  @Input() reloadedFiles: any;
  @Input() noOfAttachments: number;
  showToast = false;
  invoiceAttachments: string[] = [];
  attachSizeError = false;

  constructor(
    public toastService: ToastService,
    public warningService: WarningService
  ) {}

  ngOnInit() {
    if (this.reloadedFiles !== undefined) {
      this.reloadedFiles.forEach((element) => {
        this.invoiceAttachments.push(element.fileName);
      });
    }
  }

  /**
   * Listens to file drop event and filters the dropped files before attaching
   * to the form
   *
   * @param event : File drop event
   */
  onInvoiceDropped(event: any) {
    if (this.showToast) {
      this.showToast = !this.showToast;
    }
    if (this.attachSizeError) {
      this.attachSizeError = !this.attachSizeError;
    }
    for (const e of event) {
      if (!(e.size > 0)) {
        this.warningService.warningModal(constant.zeroFileMessage);
        // this.showToast = !this.showToast;
        // this.toastService.show(constant.zeroFileMessage, { delay: 9500 });
      } else if (!constant.allowedFileTypes.includes(e.type)) {
        this.warningService.warningModal(constant.fileTypeMessage);
        // alert(constant.fileTypeMessage);
        // this.showToast = !this.showToast;
        // this.toastService.show(constant.fileTypeMessage, { delay: 9500 });
      } else if (!constant.fileNameFormat.test(e.name)) {
        this.warningService.warningModal(constant.invalidFileNameMessage);
        // this.showToast = !this.showToast;
        // this.toastService.show(constant.invalidFileNameMessage, { delay: 9500 });
      } else if (
        this.invoiceAttachments !== undefined &&
        this.invoiceAttachments.length >= this.noOfAttachments
      ) {
        this.attachSizeError = true;
        setTimeout(
          function () {
            this.attachSizeError = false;
          }.bind(this),
          4500
        );
      } else {
        this.invoiceAttachments.push(e.name);
        this.attachedFile.emit(e);
      }
    }
  }

  /**
   * Deletes the attachment
   *
   * @param fileIndex : array index of attachment to be deleted
   */
  deleteAttachedInvoice(fileIndex: number) {
    this.invoiceAttachments.splice(fileIndex, 1);
    this.deleteFile.emit(fileIndex);
  }
}
