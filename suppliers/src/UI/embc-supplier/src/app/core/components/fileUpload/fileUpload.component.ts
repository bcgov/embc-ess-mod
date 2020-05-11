import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-fileUpload',
    templateUrl: './fileUpload.component.html',
    styleUrls: ['./fileUpload.component.scss'],
})
export class FileUploadComponent {

    invoiceAttachments: any = [];
    @Output() attachedFile = new EventEmitter<any>();
    @Output() deleteFile = new EventEmitter<any>();

    constructor() {}

    onInvoiceDropped(event: any) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.invoiceAttachments.push(element.name);
            this.attachedFile.emit(element);
          } 
    }

    deleteAttachedInvoice(fileIndex: number) {
        this.invoiceAttachments.splice(fileIndex, 1);
        this.deleteFile.emit(fileIndex);
    }
}