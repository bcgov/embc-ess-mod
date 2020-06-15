import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ToastService } from 'src/app/service/toast.service';

@Component({
    selector: 'app-fileUpload',
    templateUrl: './fileUpload.component.html',
    styleUrls: ['./fileUpload.component.scss'],
})
export class FileUploadComponent implements OnInit{

    invoiceAttachments: any = [];
    @Output() attachedFile = new EventEmitter<any>();
    @Output() deleteFile = new EventEmitter<any>();
    @Input() reloadedFiles: any;
    showToast = false;

    constructor(public toastService: ToastService) {}

    ngOnInit() {
        if (this.reloadedFiles !== undefined) {
            this.reloadedFiles.forEach(element => {
                this.invoiceAttachments.push(element.fileName);
            });
        }
    }

    onInvoiceDropped(event: any) {
        if(this.showToast) {
            this.showToast = !this.showToast
        }
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            if(element.size > 0) {
                this.invoiceAttachments.push(element.name);
                this.attachedFile.emit(element);
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
