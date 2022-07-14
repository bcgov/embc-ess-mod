import { Injectable } from '@angular/core';
import { MemberRole } from '../api/models';

export enum ActionPermission {
  canSignIntoActiveTask,
  canSignInToExpiredTask,
  canManageFiles,
  canViewRestrictedFiles,
  canViewPastFiles,

  canViewSuppliers,
  canEditSuppliers,
  canDeleteSuppliers,

  canManageTeamsCommunities,

  canViewTeamMembers,
  canEditTeamMembers,
  canDeleteTeamMembers,

  canViewSummaryReports,
  canViewDetailedReports,

  canViewCompletedESSFiles,

  canHideUnhideNotes,
  canSeeHiddenNotes,
  canSignIntoRemoteExtensions
}

export enum ModulePermission {
  dashboard,
  search,
  team,
  suppliers,
  assignedCommunities,
  reports
}

export enum ClaimType {
  action,
  module
}

export interface ClaimModel {
  claimType: ClaimType;
  claimValue: string;
}

export interface AuthorizationRoleModel {
  role: string;
  claims: ClaimModel[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private static permissionSet = AuthorizationService.initializeRoleClaims();

  private static initializeRoleClaims(): {
    tier1: ClaimModel[];
    tier2: ClaimModel[];
    tier3: ClaimModel[];
    tier4: ClaimModel[];
  } {
    const permissionSet = { tier1: [], tier2: [], tier3: [], tier4: [] };

    permissionSet.tier1 = [
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canSignIntoActiveTask
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canManageFiles
      },
      { claimType: ClaimType.module, claimValue: ModulePermission.dashboard },
      { claimType: ClaimType.module, claimValue: ModulePermission.search }
    ];
    permissionSet.tier2 = [
      ...permissionSet.tier1,
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canSignInToExpiredTask
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canViewSummaryReports
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canViewCompletedESSFiles
      },
      { claimType: ClaimType.module, claimValue: ModulePermission.team },
      { claimType: ClaimType.module, claimValue: ModulePermission.suppliers },
      { claimType: ClaimType.module, claimValue: ModulePermission.reports }
    ];
    permissionSet.tier3 = [
      ...permissionSet.tier2,
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canViewRestrictedFiles
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canViewPastFiles
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canViewDetailedReports
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canHideUnhideNotes
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canSeeHiddenNotes
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canSignIntoRemoteExtensions
      }
    ];
    permissionSet.tier4 = [
      ...permissionSet.tier3,
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canManageTeamsCommunities
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canDeleteSuppliers
      },
      {
        claimType: ClaimType.action,
        claimValue: ActionPermission.canDeleteTeamMembers
      },
      {
        claimType: ClaimType.module,
        claimValue: ModulePermission.assignedCommunities
      }
    ];
    return permissionSet;
  }

  public getClaimsForRole(role: MemberRole): ClaimModel[] {
    return AuthorizationService.permissionSet[role.toLowerCase()];
  }

  // public hasClaim(claimType: ClaimType, claimValue?: any): boolean {
  //   if (typeof claimType === 'string') {
  //     return this.isClaimValid(claimType, claimValue);
  //   } else {
  //     const claims: string[] = claimType;

  //     if (claims) {
  //       for (const claim of claims) {
  //         if (this.isClaimValid(claim)) { return true; }
  //       }
  //     }
  //   }

  //   return false;
  // }

  // private isClaimValid(claimType: ClaimType, claimValue?: string): boolean {
  //   // let ret = false;
  //   // let auth: AppUserAuth = null;
  //   // auth = this.securityObject;
  //   const auth = null;

  //   if (auth) {
  //     if (claimType.indexOf(':') >= 0) {
  //       const words: string[] = claimType.split(':');
  //       claimType = words[0].toLocaleLowerCase();
  //       claimValue = words[1];
  //     } else {
  //       claimType = claimType.toLocaleLowerCase();
  //       claimValue = claimValue ? claimValue : 'true';
  //     }
  //     const s = auth.claims.find(c => c.claimType.toLocaleLowerCase() === claimType && c.claimValue === claimValue);
  //     return auth.claims.find(c => c.claimType.toLocaleLowerCase() === claimType && c.claimValue === claimValue) != null;
  //   }
  //   return false;
  // }
}
