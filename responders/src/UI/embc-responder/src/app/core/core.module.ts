import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MaterialModule } from '../material.module';
import { EnvironmentBannerComponent } from './layout/environment-banner/environment-banner.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, EnvironmentBannerComponent],
  imports: [CommonModule, MaterialModule],
  exports: [HeaderComponent, FooterComponent, EnvironmentBannerComponent]
})
export class CoreModule {}
