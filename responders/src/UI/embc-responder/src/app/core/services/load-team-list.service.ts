import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { MemberLabelDescription, MemberRoleDescription } from '../api/models';
import { TeamsService } from '../api/services';
import { CacheService } from './cache.service';
import * as globalConst from './global-constants';

@Injectable({ providedIn: 'root' })
export class LoadTeamListService {
  private memberRoles: MemberRoleDescription[];
  private memberLabels: MemberLabelDescription[];
  constructor(
    private teamMembersService: TeamsService,
    private cacheService: CacheService,
    private alertService: AlertService
  ) {}

  public getMemberLabels(): MemberLabelDescription[] {
    return this.memberLabels
      ? this.memberLabels
      : JSON.parse(this.cacheService.get('memberLabels'))
      ? JSON.parse(this.cacheService.get('memberLabels'))
      : this.getMemberLabel();
  }

  public getMemberRoles(): MemberRoleDescription[] {
    return this.memberRoles
      ? this.memberRoles
      : JSON.parse(this.cacheService.get('memberRoles'))
      ? JSON.parse(this.cacheService.get('memberRoles'))
      : this.getMemberRole();
  }

  public async loadStaticTeamLists(): Promise<void> {
    const roles = this.teamMembersService.teamsGetMemberRoles();
    const label = this.teamMembersService.teamsGetMemberLabels();

    return forkJoin([roles, label])
      .pipe(
        map((results) => {
          this.setMemberLabels(results[1]);
          this.setMemberRoles(results[0]);
        })
      )
      .toPromise();
  }

  private setMemberRoles(memberRoles: MemberRoleDescription[]): void {
    this.memberRoles = memberRoles;
    this.cacheService.set('memberRoles', memberRoles);
  }

  private setMemberLabels(memberLabels: MemberLabelDescription[]): void {
    this.memberLabels = memberLabels;
    this.cacheService.set('memberLabels', memberLabels);
  }

  private getMemberRole(): MemberRoleDescription[] {
    let memberRoles: MemberRoleDescription[] = [];
    this.teamMembersService.teamsGetMemberRoles().subscribe({
      next: (roles) => {
        memberRoles = roles;
        this.setMemberRoles(memberRoles);
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return memberRoles;
  }

  private getMemberLabel(): MemberLabelDescription[] {
    let memberLabels: MemberLabelDescription[] = [];
    this.teamMembersService.teamsGetMemberLabels().subscribe({
      next: (labels) => {
        memberLabels = labels;
        this.setMemberLabels(memberLabels);
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return memberLabels;
  }
}
