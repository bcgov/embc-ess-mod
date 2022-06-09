import {
  Component,
  ComponentRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;

  componentRef: ComponentRef<any>;
  showCloseButton = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.componentRef = this.vcRef.createComponent(this.data.component);
    this.componentRef.instance.content = this.data.content;
    this.showCloseButton = this.data.showCloseButton;

    if (this.data.profileData !== null) {
      this.componentRef.instance.profileData = this.data.profileData;
    }

    if (this.data.voidType !== null) {
      this.componentRef.instance.voidType = this.data.voidType;
    }

    if (this.data.versionArray !== undefined) {
      this.componentRef.instance.versionArray = this.data.versionArray;
    }

    if (this.data.idle !== undefined) {
      this.componentRef.instance.idle = this.data.idle;
    }

    if (this.data.essFile !== undefined) {
      this.componentRef.instance.essFile = this.data.essFile;
    }

    this.componentRef.instance.outputEvent.subscribe((value) => {
      this.buttonAction(value);
    });
  }

  buttonAction(action: string): void {
    this.dialogRef.close(action);
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
