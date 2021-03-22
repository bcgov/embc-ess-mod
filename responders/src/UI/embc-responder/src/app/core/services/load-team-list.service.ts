import { Injectable } from '@angular/core';
import { MemberLabel, MemberLabelDescription, MemberRole, MemberRoleDescription } from '../api/models';
import { TeamMembersService } from '../api/services';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class LoadTeamListService {

    constructor(private teamMembersService: TeamMembersService, private cacheService: CacheService) { }

    private memberRoles: MemberRoleDescription[];
    private memberLabels: MemberLabelDescription[];

    public getMemberRoles(): MemberRoleDescription[] {
        return this.memberRoles ? this.memberRoles :
            (JSON.parse(this.cacheService.get('memberRoles')) ?
                JSON.parse(this.cacheService.get('memberRoles')) : this.getMemberRole());
    }

    private setMemberRoles(memberRoles: MemberRoleDescription[]): void {
        this.memberRoles = memberRoles;
        this.cacheService.set('memberRoles', memberRoles);
    }

    public getMemberLabels(): MemberLabelDescription[] {
        return this.memberLabels ? this.memberLabels :
            (JSON.parse(this.cacheService.get('memberLabels')) ?
                JSON.parse(this.cacheService.get('memberLabels')) : this.getMemberLabel());
    }

    private setMemberLabels(memberLabels: MemberLabelDescription[]): void {
        this.memberLabels = memberLabels;
        this.cacheService.set('memberLabels', memberLabels);
    }

    private getMemberRole(): MemberRoleDescription[] {
        let memberRoles: MemberRoleDescription[] = [];
        this.teamMembersService.teamMembersGetMemberRoles().subscribe(roles => {
            memberRoles = roles;
            this.setMemberRoles(memberRoles);
        })
        return memberRoles;
    }

    private getMemberLabel(): MemberLabelDescription[] {
        let memberLabels: MemberLabelDescription[] = [];
        this.teamMembersService.teamMembersGetMemberLabels().subscribe(labels => {
            memberLabels = labels;
            this.setMemberLabels(memberLabels);
        })
        return memberLabels;
    }
}
