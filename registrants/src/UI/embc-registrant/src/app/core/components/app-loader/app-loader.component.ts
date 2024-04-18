import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, NgStyle]
})
export class AppLoaderComponent {
  @Input() showLoader: boolean;
  @Input() strokeWidth: number;
  @Input() diameter: number;
  @Input() color: string;

  get spinnerColor(): { color: string } {
    return { color: this.color };
  }
}
