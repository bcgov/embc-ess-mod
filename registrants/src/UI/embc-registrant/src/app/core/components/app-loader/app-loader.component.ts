import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
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
