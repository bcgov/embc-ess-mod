import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ClaimType,
  ModulePermission
} from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-top-nav-menu',
  templateUrl: './top-nav-menu.component.html',
  styleUrls: ['./top-nav-menu.component.scss']
})
export class TopNavMenuComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  onToggle(): void {
    this.sidenavToggle.emit();
  }

  public hasPermission(module: string): boolean {
    return this.userService.hasClaim(
      ClaimType.module,
      ModulePermission[module]
    );
  }
}
