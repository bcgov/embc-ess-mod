import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, LoginPageRoutingModule, MatButtonModule, LoginPageComponent]
})
export class LoginPageModule {}
