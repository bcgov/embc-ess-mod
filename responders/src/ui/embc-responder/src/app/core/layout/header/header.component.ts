import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(private router: Router, private authService: AuthService) {}

    homeButton(): void {

    }

    openUserProfile(): void {
        this.router.navigate(['/responder-access/user-profile']);
    }

    signOut(): void {
        this.authService.logout();
    }

}
