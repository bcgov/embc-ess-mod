import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-fileUpload',
    templateUrl: './fileUpload.component.html',
    styleUrls: ['./fileUpload.component.scss'],
})
export class FileUploadComponent implements OnInit{

    invoiceAttachments: any = [];
    @Output() attachedFile = new EventEmitter<any>();
    @Output() deleteFile = new EventEmitter<any>();
    @Input() reloadedFiles: any

    constructor() {}

    ngOnInit() {
        if(this.reloadedFiles !== undefined) {
            this.reloadedFiles.forEach(element => {
                this.invoiceAttachments.push(element.fileName);
                //this.attachedFile.emit(element);
            });
        }
    }

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