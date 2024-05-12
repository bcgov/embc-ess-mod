import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    imports: [CommonModule, ContactRoutingModule, MaterialModule, ReactiveFormsModule, IMaskModule, ContactComponent]
})
export class ContactModule {}
