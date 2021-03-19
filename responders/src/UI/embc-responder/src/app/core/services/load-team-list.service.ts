import { Injectable } from '@angular/core';
import { MemberLabel, MemberRole } from '../api/models';
import { TeamMembersService } from '../api/services';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class LoadTeamListService {

    constructor(private teamMembersService: TeamMembersService, private cacheService: CacheService) { }

    private memberRoles: MemberRole[];
    private memberLabels: MemberLabel[];

    public getMemberRoles(): MemberRole[] {
        return this.memberRoles ? this.memberRoles :
            (JSON.parse(this.cacheService.get('memberRoles')) ?
                JSON.parse(this.cacheService.get('memberRoles')) : this.getMemberRole());
    }

    private setMemberRoles(memberRoles: MemberRole[]): void {
        this.memberRoles = memberRoles;
        this.cacheService.set('memberRoles', memberRoles);
    }

    public getMemberLabels(): MemberLabel[] {
        return this.memberLabels ? this.memberLabels :
            (JSON.parse(this.cacheService.get('memberLabels')) ?
                JSON.parse(this.cacheService.get('memberLabels')) : this.getMemberLabel());
    }

    private setMemberLabels(memberLabels: MemberLabel[]): void {
        this.memberLabels = memberLabels;
        this.cacheService.set('memberLabels', memberLabels);
    }

    private getMemberRole(): MemberRole[] {
        let memberRoles: MemberRole[] = [];
        this.teamMembersService.teamMembersGetMemberRoles().subscribe(roles => {
            memberRoles = roles;
            this.setMemberRoles(memberRoles);
        })
        return memberRoles;
    }

    private getMemberLabel(): MemberLabel[] {
        let memberLabels: MemberLabel[] = [];
        this.teamMembersService.teamMembersGetMemberLabels().subscribe(labels => {
            memberLabels = labels;
            this.setMemberLabels(memberLabels);
        })
        return memberLabels;
    }
}
