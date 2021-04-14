import { Component, OnInit } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(apiConfig: ApiConfiguration) {
    apiConfig.rootUrl = '';
  }

  ngOnInit(): void {
    window.addEventListener('keyup', this.disableF5);
    window.addEventListener('keydown', this.disableF5);
    // window.onbeforeunload
  }

  private disableF5(e: any): void {
    if ((e.which || e.keyCode) === 116) {
      e.preventDefault();
    }

  }
}

