import { AssignedCommunity } from '../api/models';
import { Community } from '../services/locations.service';

export interface TeamCommunityModel extends Community, AssignedCommunity {
  allowSelect?: boolean;
  conflict?: boolean;
}
