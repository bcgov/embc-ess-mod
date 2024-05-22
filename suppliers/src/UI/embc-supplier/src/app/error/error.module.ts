import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { CoreModule } from '../core/core.module';
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  imports: [CommonModule, ErrorRoutingModule, ErrorComponent]
})
export class ErrorModule {}
