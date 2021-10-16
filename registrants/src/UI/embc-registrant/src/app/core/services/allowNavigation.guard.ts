import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { ProfileService } from '../../feature-components/profile/profile.service';
import { ProfileMappingService } from '../../feature-components/profile/profile-mapping.service';
import { ConflictManagementService } from 'src/app/sharedModules/components/conflict-management/conflict-management.service';
import { EvacuationFileDataService } from 'src/app/sharedModules/components/evacuation-file/evacuation-file-data.service';
import { AlertService } from './alert.service';
import * as globalConst from './globalConstants';

@Injectable({ providedIn: 'root' })
export class AllowNavigationGuard implements CanActivate {
  constructor(
    private router: Router,
    private profileService: ProfileService,
    public mappingService: ProfileMappingService,
    private conflictService: ConflictManagementService,
    private evacuationFileDataService: EvacuationFileDataService,
    private alertService: AlertService
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    this.profileService.profileExists().subscribe(
      (exists: boolean) => {
        if (!exists && state.url === '/verified-registration') {
          this.profileService.getLoginProfile();
          this.router.navigate(['/verified-registration/collection-notice']);
        } else {
          if (
            state.url === '/verified-registration/conflicts' &&
            this.conflictService.getCount() === 0
          ) {
            this.profileService.getProfile();
            this.router.navigate(['/verified-registration/dashboard']);
          } else {
            if (exists) {
              this.profileService.getConflicts().subscribe(
                (conflicts) => {
                  this.mappingService.mapConflicts(conflicts);
                  if (state.url === '/verified-registration') {
                    this.profileService.getProfile();
                    if (conflicts.length !== 0) {
                      this.router.navigate([
                        '/verified-registration/conflicts'
                      ]);
                    } else {
                      this.router.navigate([
                        '/verified-registration/dashboard'
                      ]);
                    }
                  } else if (
                    (state.url === '/verified-registration/conflicts' &&
                      this.conflictService.getCount() !== 0) ||
                    state.url.match('/dashboard/')
                  ) {
                    this.profileService.getProfile();
                    if (
                      state.url.match('/dashboard/current/') &&
                      this.evacuationFileDataService.essFileId === undefined
                    ) {
                      this.router.navigate([
                        '/verified-registration/dashboard/current'
                      ]);
                    } else if (
                      state.url.match('/dashboard/past/') &&
                      this.evacuationFileDataService.essFileId === undefined
                    ) {
                      this.router.navigate([
                        '/verified-registration/dashboard/past'
                      ]);
                    }
                  }
                },
                (error) => {
                  this.alertService.clearAlert();
                  this.alertService.setAlert('danger', globalConst.systemError);
                }
              );
            }
          }
        }
      },
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.profileExistError);
      }
    );

    return true;
  }
}
