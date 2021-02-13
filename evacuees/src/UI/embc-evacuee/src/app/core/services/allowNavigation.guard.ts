import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { ProfileService } from '../../sharedModules/components/profile/profile.service';
import { ProfileMappingService } from '../../sharedModules/components/profile/profile-mapping.service';
import { ConflictManagementService } from 'src/app/sharedModules/components/conflict-management/conflict-management.service';

@Injectable({ providedIn: 'root' })
export class AllowNavigationGuard implements CanActivate {

    constructor(private router: Router, private profileService: ProfileService, public mappingService: ProfileMappingService,
        private conflictService: ConflictManagementService) { }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Promise<boolean | UrlTree> {

        this.profileService.getProfile();
        this.profileService.profileExists().subscribe((exists: boolean) => {
            if (!exists && state.url === '/verified-registration') {
                this.profileService.getLoginProfile();
                this.router.navigate(['/verified-registration/collection-notice']);
            } else {
                console.log(this.conflictService.getCount())
                if (state.url === '/verified-registration/conflicts' && this.conflictService.getCount() === 0) {
                    this.router.navigate(['/verified-registration/dashboard']);
                } else {
                    this.profileService.getConflicts().subscribe(conflicts => {
                        this.mappingService.mapConflicts(conflicts);
                        if (state.url === '/verified-registration') {
                            if (conflicts.length !== 0) {
                                this.router.navigate(['/verified-registration/conflicts']);
                            } else {
                                this.router.navigate(['/verified-registration/dashboard']);
                            }
                        }
                    });
                }
            }
        });

        return true;
    }
}


