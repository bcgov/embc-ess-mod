import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Community } from 'src/app/core/api/models';
import { TableColumnModel } from 'src/app/core/models/table-column.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { LoadLocationsService } from 'src/app/core/services/load-locations.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit, OnDestroy {

  @ViewChild('target', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  componentRef: ComponentRef<any>;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private resolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.vcRef.createComponent(factory);
    this.componentRef.instance.outputEvent.subscribe(value =>
      {
       this.buttonAction(value)
      })
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
