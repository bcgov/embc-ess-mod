import { EssTask } from '../api/models';

export interface EssTaskModel extends EssTask {
  communityName?: string;
}
