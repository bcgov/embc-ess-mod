import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss'],
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule, NgStyle]
})
export class AppLoaderComponent implements OnInit {
  @Input() showLoader: boolean;
  @Input() strokeWidth: number;
  @Input() diameter: number;
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {}

  get spinnerColor(): { color: string } {
    return { color: this.color };
  }
}
