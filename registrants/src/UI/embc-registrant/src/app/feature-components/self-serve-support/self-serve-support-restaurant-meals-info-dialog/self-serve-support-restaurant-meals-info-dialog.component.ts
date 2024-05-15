import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-self-serve-support-restaurant-meals-info-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './self-serve-support-restaurant-meals-info-dialog.component.html',
  styles: [
    `
      :host {
        display: block;
        border: 2px solid #169bd5;
      }
    `
  ]
})
export class SelfServeSupportRestaurantMealsInfoDialogComponent {}
