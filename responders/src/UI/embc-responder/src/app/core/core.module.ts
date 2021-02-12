import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
     CommonModule,
     MaterialModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
 
})
export class CoreModule { }
