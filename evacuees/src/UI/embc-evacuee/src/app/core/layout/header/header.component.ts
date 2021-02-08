import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileApiService } from '../../services/api/profileApi.service';
import { DataService } from '../../services/data.service';
import { FormCreationService } from '../../services/formCreation.service';
import { ProfileMappingService } from '../../services/mappings/profileMapping.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    showLoginMatMenu: boolean;


    constructor(private dataService: DataService, private formCreationService: FormCreationService) { }

    ngOnInit(): void {

        this.dataService.getLoginStatus().subscribe(value => {
            this.showLoginMatMenu = value;
        });
    }

    homeButton(): void { }

    signOut(): void {
        this.dataService.setLoginStatus(false);
    }
}
