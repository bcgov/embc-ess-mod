import { SelectedPathType } from '../../models/appBase.model';
import { EssTaskModel } from '../../models/ess-task.model';
import { CacheService } from '../cache.service';

export class AppBaseService {
  private selectedEssTaskVal?: EssTaskModel;

  private selectedUserPathwayVal?: SelectedPathType;

  constructor(public cacheService: CacheService) {}

  public get selectedEssTask(): EssTaskModel {
    return this.selectedEssTaskVal;
  }
  public set selectedEssTask(value: EssTaskModel) {
    this.selectedEssTaskVal = value;
  }

  public get selectedUserPathway(): SelectedPathType {
    return this.selectedUserPathwayVal;
  }
  public set selectedUserPathway(value: SelectedPathType) {
    this.selectedUserPathwayVal = value;
  }
}
