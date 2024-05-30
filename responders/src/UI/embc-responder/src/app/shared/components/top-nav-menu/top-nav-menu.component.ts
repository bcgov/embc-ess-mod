import { Component, EventEmitter, Output } from '@angular/core';
import { ClaimType, ModulePermission } from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';
import { RouterLinkActive, RouterLink } from '@angular/router';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-top-nav-menu',
  templateUrl: './top-nav-menu.component.html',
  styleUrls: ['./top-nav-menu.component.scss'],
  standalone: true,
  imports: [MatToolbar, MatIconButton, MatIcon, MatAnchor, RouterLinkActive, RouterLink]
})
export class TopNavMenuComponent {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(public userService: UserService) {}

  onToggle(): void {
    this.sidenavToggle.emit();
  }

  public hasPermission(module: string): boolean {
    return this.userService.hasClaim(ClaimType.module, ModulePermission[module]);
  }
}
