import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormCreationService } from '../../services/formCreation.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { CacheService } from '../../services/cache.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    showLoginMatMenu: boolean;


    constructor(private formCreationService: FormCreationService, private authService: AuthService, private cacheService: CacheService) { }

    ngOnInit(): void {

        this.authService.isAuthenticated().pipe(map(isAuthenticated => {
            if (isAuthenticated) {
                this.showLoginMatMenu = true;
            } else {
                this.showLoginMatMenu = false;
            }
        })).subscribe();


    }

    homeButton(): void { }

    signOut(): void {
        //this.dataService.setLoginStatus(false);
        this.authService.logout('https://www.emergencyinfobc.gov.bc.ca/');
        this.cacheService.clear();

    }
}
