import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import { EnvironmentBannerComponent } from './layout/environment-banner/environment-banner.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    HeaderComponent,
    FooterComponent,
    EnvironmentBannerComponent
  ],
  exports: [HeaderComponent, FooterComponent, EnvironmentBannerComponent]
})
export class CoreModule {}
