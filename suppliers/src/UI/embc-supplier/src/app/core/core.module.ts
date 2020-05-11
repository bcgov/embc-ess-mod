import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './directives/DragDrop.directive';
import { FileUploadComponent } from './components/fileUpload/fileUpload.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      DragDropDirective,
      FileUploadComponent
    ],
  exports: [
      DragDropDirective,
      FileUploadComponent
    ]
})
export class CoreModule { }