import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthenticationService) { }

  public async ngOnInit(): Promise<void> {
    try {
      const nextUrl = await this.authService.login();
    }
    catch (error) {
      console.error(error);
    } finally {
      console.log("something");
    }
  }
}
