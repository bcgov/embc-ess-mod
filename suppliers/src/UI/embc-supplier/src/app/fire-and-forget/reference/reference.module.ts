import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceComponent } from './reference.component';
import { ReferenceRoutingModule } from './reference-routing.module';

@NgModule({
  imports: [CommonModule, ReferenceRoutingModule],
  declarations: [ReferenceComponent],
  exports: []
})
export class ReferenceModule {}
