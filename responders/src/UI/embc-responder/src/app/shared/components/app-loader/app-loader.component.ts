import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
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
