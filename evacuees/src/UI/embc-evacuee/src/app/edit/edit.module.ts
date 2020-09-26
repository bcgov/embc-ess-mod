import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditRoutingModule } from './edit-routing.module';
import { ComponentWrapperModule } from '../core/components/component-wrapper/component-wrapper.module';
import { EditComponent } from './edit.component';


@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    ComponentWrapperModule,
    ReactiveFormsModule
  ]
})
export class EditModule { }
