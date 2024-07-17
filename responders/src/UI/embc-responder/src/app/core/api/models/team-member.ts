/* tslint:disable */
/* eslint-disable */
import { MemberLabel } from '../models/member-label';
import { MemberRole } from '../models/member-role';
export interface TeamMember {
  agreementSignDate?: string | null;
  email?: string | null;
  firstName: string;
  id?: string | null;
  isActive?: boolean;
  isUserNameEditable?: boolean;
  label?: MemberLabel;
  lastName: string;
  lastSuccessfulLogin?: string | null;
  phone?: string | null;
  role: MemberRole;
  teamId?: string | null;
  teamName?: string | null;
  userName: string;
}
