import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { Project } from '@core/models/projects/types';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { Notify } from '@core/lib/alert';
import { ResponseParser } from '@core/lib/parsers/response-parser';
import { ToastrService } from 'ngx-toastr';
import {
  ReorderData,
  Reorderitem,
} from 'src/app/components/reorder/reorder.types';

interface LegacyProject {
  count: number;
  date: string;
  description: string;
  image_url: string;
  name: string;
  order: number;
  url: string;
}

const ADD_PROJECT = 'Add Project';

@UnsubscribeOnDestroy()
@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  public projects: Project[] = [];
  private projectSubs$: Subscription;
  private selectedProjectSubs$: Subscription;
  public selectedProject: Project | undefined;
  private projectsClone = [];

  public projectModalConfig: ModalConfig = {
    heading: ADD_PROJECT,
    show: false,
    onClose: () => {
      this.projectModalConfig.show = false;
    },
  };

  public viewProjectModalConfig: ModalConfig = {
    heading: '',
    show: false,
    onClose: () => {
      this.viewProjectModalConfig.show = false;
    },
  };

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.projectService.refreshProjects();
    this.projectSubs$ = this.projectService.projectsCollection.subscribe(
      (projectModel) => {
        if (projectModel) {
          this.projects = projectModel.map((m) => m.pluckAll());
          this.projectsClone = [...this.projects];
        }
      }
    );

    this.selectedProjectSubs$ = this.projectService.selectedProject$.subscribe(
      (project) => {
        if (project) {
          this.selectedProject = project;
        }
      }
    );
  }

  public handleAdd(): void {
    this.projectService.deselect();
    this.projectModalConfig.show = true;
    this.projectModalConfig.heading = ADD_PROJECT;
  }

  public deleteProject(projectId: string) {
    Notify.confirm({
      message: 'Project will be deleted permanently',
      callback: () => {
        this.projectService.delete(projectId);
      },
    });
  }

  public handleView(project: Project) {
    this.projectService.select(project);
    this.viewProjectModalConfig.heading = project.name;
    this.viewProjectModalConfig.show = true;
  }

  public handleCloseViewModal() {
    this.viewProjectModalConfig.show = false;
    this.projectService.deselect();
  }

  public handleEdit(project: Project) {
    this.projectService.select(project);
    this.projectModalConfig.heading = project.name;
    this.projectModalConfig.show = true;
  }

  /**
   * @NOTE
   * DO NOT USE REHYDRATE FUNCTION UNTIL YOU ARE SUPER SURE WHAT IT WILL DO
   */
  private async rehydrate() {
    const res = await fetch('assets/app.json');
    const data = await res.json();
    const legacy_projects = new ResponseParser(
      data.projects
    ).parse() as LegacyProject[];
    const projects: Project[] = legacy_projects.map((p) => {
      return {
        name: p.name,
        createdAt: new Date().toDateString(),
        imageUrl: p.image_url,
        description: '',
        content: p.description,
        views: p.count,
        tags: [],
        url: p.url,
      };
    });

    projects.forEach((project) => {
      this.projectService.create(project);
    });
  }

  public reorderData: ReorderData = [];

  public setReorderData() {
    this.reorderData = this.projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        imageUrl: project.imageUrl,
        sideContent: '',
      };
    });
  }


  public reorderItem(item: Reorderitem, list: ReorderData): void {
    list.splice(list.indexOf(item as any), 1);
    this.reorderData = list;
  }

  onReorder() {
    const projects = [];

    this.reorderData.forEach((item) => {
      projects.push(this.projects.find((project) => item.id === project.id));
    });

    projects.forEach((project, index) => {
      project.pos = index + 1;
      this.projectService.changePosition(project);
    });


    this.toastr.success('Successfully saved');
    this.projects = [...projects];
  }
}
