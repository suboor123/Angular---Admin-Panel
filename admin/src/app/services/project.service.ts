import { Injectable } from '@angular/core';
import { ProjectModel } from '@core/models/projects';
import { Project } from '@core/models/projects/types';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  from,
  Observable,
} from 'rxjs';
import { handleError } from './service-helper';
import { TagsService } from './tags.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject$: BehaviorSubject<ProjectModel[]> =
    new BehaviorSubject<ProjectModel[]>([]);

  public projectsCollection: Observable<ProjectModel[]> =
    this.projectsSubject$.asObservable();

  private projects: Project[] = [];

  public selectedProject$: BehaviorSubject<Project> = new BehaviorSubject<
    Project | undefined
  >(undefined);

  constructor(private toastr: ToastrService, private tagService: TagsService) {}

  refreshProjects() {
    from<Promise<ProjectModel[]>>(ProjectModel.syncProjects()).subscribe(
      (projectModels: ProjectModel[]) => {
        if (projectModels) {
          this.projectsSubject$.next(projectModels);
          this.projects = projectModels.map((model) => model.pluckAll());
        }
      },
      handleError
    );
  }


  create(project: Project) {
    ProjectModel.create(project);
    this.refreshProjects();
    this.toastr.success('Successfully Saved.');
  }

  push(project: Project) {
    this.projects.unshift(project);
    this.projectsSubject$.next(
      this.projects.map((t) => ProjectModel.make(t)) || []
    );
  }

  delete(projectId: string) {
    ProjectModel.delete(projectId);
    this.projects = this.projects.filter((project) => project.id !== projectId);
    this.projectsSubject$.next(
      this.projects.map((t) => ProjectModel.make(t)) || []
    );
    this.toastr.success('Deleted successfully.');
  }

  update(project: Project) {
    ProjectModel.update(project);
    this.projects.forEach((p, i) => {
      if (p.id === project.id) {
        this.projects[i] = project;
      }
    });
    this.projectsSubject$.next(
      this.projects.map((p) => ProjectModel.make(p)) || []
    );
    this.toastr.success('Successfully Saved.');
  }

  select(project: Project) {
    this.selectedProject$.next(project);
  }

  deselect() {
    this.selectedProject$.next(undefined);
  }

  changePosition(project: Project) {
    ProjectModel.updateProjectPosition(project);
  }
}
