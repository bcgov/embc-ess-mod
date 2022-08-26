import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    SuppliersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
