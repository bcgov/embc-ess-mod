import { Component } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(apiConfig: ApiConfiguration) {
    apiConfig.rootUrl = '';
  }
}
