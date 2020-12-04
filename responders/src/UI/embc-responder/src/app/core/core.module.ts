import { NgModule } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TopNavMenuComponent } from './top-nav-menu/top-nav-menu.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToggleSideNavComponent } from './toggle-side-nav/toggle-side-nav.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TopNavMenuComponent,
    ToggleSideNavComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TopNavMenuComponent,
    ToggleSideNavComponent
  ]
})
export class CoreModule { }
