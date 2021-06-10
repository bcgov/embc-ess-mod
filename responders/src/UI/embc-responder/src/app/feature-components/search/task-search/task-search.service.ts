import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EssTask } from 'src/app/core/api/models';
import { TasksService } from 'src/app/core/api/services';
import { EssTaskModel } from 'src/app/core/models/ess-task.model';
import { LocationsService } from 'src/app/core/services/locations.service';

@Injectable({ providedIn: 'root' })
export class TaskSearchService {
  constructor(
    private taskService: TasksService,
    private locationsService: LocationsService
  ) {}

  searchTask(taskNumber: string): Observable<EssTask> {
    return this.taskService.tasksGetTask({ taskId: taskNumber }).pipe(
      map((essTask: EssTaskModel) => {
        const communities = this.locationsService.getCommunityList();
        const community = communities.find(
          (comm) => comm.code === essTask.communityCode
        );
        essTask.communityName = community.name;
        console.log(essTask);
        return essTask;
      })
    );
  }
}
