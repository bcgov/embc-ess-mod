import { AssignedCommunity, Community } from "../api/models";

export interface TeamCommunityModel extends Community, AssignedCommunity {
    allowSelect?: boolean;
    conflict?: boolean;
}