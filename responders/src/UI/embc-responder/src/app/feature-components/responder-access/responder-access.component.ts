import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavMenuComponent } from '../../shared/components/top-nav-menu/top-nav-menu.component';
import { ToggleSideNavComponent } from '../../shared/components/toggle-side-nav/toggle-side-nav.component';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-responder-access',
  templateUrl: './responder-access.component.html',
  styleUrls: ['./responder-access.component.scss'],
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    ToggleSideNavComponent,
    MatSidenavContent,
    TopNavMenuComponent,
    RouterOutlet
  ]
})
export class ResponderAccessComponent {}
