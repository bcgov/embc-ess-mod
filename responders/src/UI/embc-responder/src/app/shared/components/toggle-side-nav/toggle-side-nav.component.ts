import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-toggle-side-nav',
  templateUrl: './toggle-side-nav.component.html',
  styleUrls: ['./toggle-side-nav.component.scss'],
  standalone: true,
  imports: [MatNavList, MatListItem, RouterLinkActive, RouterLink, MatDivider]
})
export class ToggleSideNavComponent {
  @Output() public sidenavClose = new EventEmitter();

  onSideNavClose(): void {
    this.sidenavClose.emit();
  }
}
