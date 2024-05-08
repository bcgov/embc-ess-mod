import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app--self-serve-support-opt-out-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './self-serve-support-opt-out-dialog.component.html',
  styles: [
    `
      :host {
        display: block;
        padding: var(--size-3);
      }
    `
  ]
})
export class SelfServeSupportOptOutDialogComponent {}
