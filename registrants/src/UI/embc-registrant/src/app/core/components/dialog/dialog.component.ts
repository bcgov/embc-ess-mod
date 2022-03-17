import { ViewChild } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { ComponentRef } from '@angular/core';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;
  componentRef: ComponentRef<any>;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.componentRef = this.vcRef.createComponent(this.data.component);
    this.componentRef.instance.content = this.data.content;

    if (this.data.essFileData !== null) {
      this.componentRef.instance.essFileData = this.data.essFileData;
    }

    if (this.data.initDialog !== null) {
      this.componentRef.instance.initDialog = this.data.initDialog;
    }

    if (this.data.idle !== undefined) {
      this.componentRef.instance.idle = this.data.idle;
    }

    this.componentRef.instance.outputEvent.subscribe((value) => {
      this.buttonAction(value);
    });
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  buttonAction(action: string): void {
    this.dialogRef.close(action);
  }
}
