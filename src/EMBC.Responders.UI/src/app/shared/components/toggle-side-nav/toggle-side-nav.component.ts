import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-side-nav',
  templateUrl: './toggle-side-nav.component.html',
  styleUrls: ['./toggle-side-nav.component.scss']
})
export class ToggleSideNavComponent implements OnInit {
  @Output() public sidenavClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onSideNavClose(): void {
    this.sidenavClose.emit();
  }
}
