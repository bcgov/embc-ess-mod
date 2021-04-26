import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  appVersion = '1.0.0';

  ngOnInit(): void {
    // this.appVersion = environment.version;
  }
}
