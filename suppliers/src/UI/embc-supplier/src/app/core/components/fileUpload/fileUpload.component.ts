import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './fileUpload.component.html',
    styleUrls: ['./fileUpload.component.scss'],
})
export class FileUploadComponent implements OnInit {

    invoiceAttachments: any = [];
    @Output() attachedFile = new EventEmitter<any>();
    @Output() deleteFile = new EventEmitter<any>();
    @Input() reloadedFiles: any;
    showToast = false;

    constructor(public toastService: ToastService) { }

    ngOnInit() {
        if (this.reloadedFiles !== undefined) {
            this.reloadedFiles.forEach(element => {
                this.invoiceAttachments.push(element.fileName);
            });
        }
    }

    onInvoiceDropped(event: any) {
        if (this.showToast) {
            this.showToast = !this.showToast;
        }
        for (const e of event) {
            if (e.size > 0) {
                this.invoiceAttachments.push(e.name);
                this.attachedFile.emit(e);
            } else {
                this.showToast = !this.showToast;
                this.toastService.show('Attachment file size should be greater than 0Kb', { delay: 9500 });
            }
        }
    }

    deleteAttachedInvoice(fileIndex: number) {
        this.invoiceAttachments.splice(fileIndex, 1);
        this.deleteFile.emit(fileIndex);
    }
}
