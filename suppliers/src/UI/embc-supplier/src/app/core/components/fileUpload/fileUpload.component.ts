import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Toast, ToastService } from 'src/app/core/services/toast.service';
import { WarningService } from 'src/app/core/services/warning.service';
import * as constant from 'src/app/core/services/globalConstants';
import { DragDropDirective } from '../../directives/DragDrop.directive';
import { faCheck, faFileImage, faFilePdf, faInfoCircle, faTrash, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.scss'],
  standalone: true,
  imports: [DragDropDirective, FontAwesomeModule]
})
export class FileUploadComponent implements OnInit {
  @Output() attachedFile = new EventEmitter<any>();
  @Output() deleteFile = new EventEmitter<any>();
  @Input() reloadedFiles: any;
  @Input() noOfAttachments: number;
  invoiceAttachments: string[] = [];
  attachSizeError = false;
  faTrash = faTrash;
  faFilePdf = faFilePdf;
  faFileImage = faFileImage;

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
    for (const e of event) {
      if (!(e.size > 0)) {
        this.toastService.show(constant.zeroFileMessage, {
          classname: 'bg-danger text-light',
          delay: constant.toastDelay,
          icon: faWarning
        });
      } else if (!constant.allowedFileTypes.includes(e.type)) {
        this.toastService.show(constant.fileTypeMessage, {
          classname: 'bg-danger text-light',
          delay: constant.toastDelay,
          icon: faWarning
        });
      } else if (!constant.fileNameFormat.test(e.name)) {
        this.toastService.show(constant.invalidFileNameMessage, {
          classname: 'bg-danger text-light',
          delay: constant.toastDelay,
          icon: faWarning
        });
      } else if (e.size > constant.maxFileSize) {
        this.toastService.show(constant.fileTooLargeMessage, {
          classname: 'bg-danger text-light',
          delay: constant.toastDelay,
          icon: faWarning
        });
      } else if (this.invoiceAttachments !== undefined && this.invoiceAttachments.length >= this.noOfAttachments) {
        this.toastService.show(constant.tooManyFilesMessage, {
          classname: 'bg-danger text-light',
          delay: constant.toastDelay,
          icon: faWarning
        });
      } else {
        this.invoiceAttachments.push(e.name);
        this.attachedFile.emit(e);
        this.toastService.show(e.name + ' attached successfully', {
          classname: 'bg-success text-light',
          delay: constant.toastDelay,
          icon: faCheck
        });
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
    this.toastService.show('Attachment deleted', {
      classname: 'bg-info text-light',
      delay: constant.toastDelay,
      icon: faInfoCircle
    });
  }

  getFileImage(file: string) {
    if (file.includes('.pdf')) {
      return faFilePdf;
    } else {
      return faFileImage;
    }
  }
}
