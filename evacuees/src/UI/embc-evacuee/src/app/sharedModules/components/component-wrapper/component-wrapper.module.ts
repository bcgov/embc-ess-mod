import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentWrapperComponent } from './component-wrapper.component';

@NgModule({
  declarations: [ComponentWrapperComponent],
  imports: [CommonModule],
  exports: [ComponentWrapperComponent]
})
export class ComponentWrapperModule {}
