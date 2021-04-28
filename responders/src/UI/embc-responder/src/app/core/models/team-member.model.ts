import { TeamMember } from '../api/models';

export interface TeamMemberModel extends TeamMember {
  roleDescription: string;
  labelDescription: string;
}
