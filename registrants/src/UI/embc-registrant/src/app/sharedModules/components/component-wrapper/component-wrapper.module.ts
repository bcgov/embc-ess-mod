import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentWrapperComponent } from './component-wrapper.component';

@NgModule({
  imports: [CommonModule, ComponentWrapperComponent],
  exports: [ComponentWrapperComponent]
})
export class ComponentWrapperModule {}
