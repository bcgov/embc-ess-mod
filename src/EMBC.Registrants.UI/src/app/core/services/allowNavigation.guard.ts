import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RoutesRecognized,
  UrlTree
} from '@angular/router';
import { ProfileMappingService } from '../../feature-components/profile/profile-mapping.service';
import { filter, pairwise } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllowNavigationGuard implements CanActivate {
  private fromUrl: string;

  constructor(
    private router: Router,
    public mappingService: ProfileMappingService
  ) {}

  public async canActivate(): Promise<boolean | UrlTree> {
    this.router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        this.fromUrl = events[0].urlAfterRedirects;
      });
    if (
      this.fromUrl &&
      this.fromUrl.startsWith('/verified-registration/dashboard')
    ) {
      return false;
    } else {
      return true;
    }
  }
}
