
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';

@NgModule({
    declarations: [
        DialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [
        DialogComponent
    ]
})
export class DialogModule { }
