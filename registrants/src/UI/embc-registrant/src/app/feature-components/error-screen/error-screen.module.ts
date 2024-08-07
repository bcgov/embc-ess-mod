import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorScreenComponent } from './error-screen.component';
import { ErrorScreenRoutingModule } from './error-screen-routing.module';

@NgModule({
  imports: [CommonModule, ErrorScreenRoutingModule, ErrorScreenComponent]
})
export class ErrorScreenModule {}
