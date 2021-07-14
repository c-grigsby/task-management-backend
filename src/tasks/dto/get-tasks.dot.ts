import { TaskStatus } from '../task.model';

export class GetTasksFilterDuo {
  status?: TaskStatus;
  search?: string;
}
