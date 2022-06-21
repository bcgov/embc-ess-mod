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

  /**
   * Gets the task details from server and maps the incoming
   * community code to community name
   *
   * @param taskNumber User input task number
   * @returns Observable of type ess task
   */
  searchTask(taskNumber: string): Observable<EssTask> {
    return this.taskService.tasksGetTask({ taskId: taskNumber }).pipe(
      map((essTask: EssTaskModel) => {
        const communities = this.locationsService.getCommunityList();
        const community = communities.find(
          (comm) => comm.code === essTask.communityCode
        );
        essTask.communityName = community.name;
        return essTask;
      })
    );
  }

  /**
   * Signs into the task
   *
   * @param taskNumber User input task number
   * @returns void observable
   */
  taskSignIn(taskNumber: string): Observable<void> {
    return this.taskService.tasksSignIn({ body: { taskId: taskNumber } });
  }
}
