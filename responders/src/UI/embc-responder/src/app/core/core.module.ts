import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MaterialModule } from '../material.module';
import { EnvironmentBannerComponent } from './layout/environment-banner/environment-banner.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, EnvironmentBannerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  exports: [HeaderComponent, FooterComponent, EnvironmentBannerComponent]
})
export class CoreModule {}
