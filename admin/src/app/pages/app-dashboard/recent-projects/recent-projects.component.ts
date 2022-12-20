import { Component, OnInit } from '@angular/core';
import { ProjectModel } from '@core/models/projects';
import { Project } from '@core/models/projects/types';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'recent-projects',
  templateUrl: './recent-projects.component.html',
  styleUrls: ['./recent-projects.component.css']
})
export class RecentProjectsComponent implements OnInit {

  projectSubs$: Subscription;
  projects: Project[] = []

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.refreshProjects();
    this.projectSubs$ = this.projectService.projectsCollection.subscribe((pms: ProjectModel[]) => {
      if(pms) {
        this.projects = pms.map(pm => pm.pluckAll()).sort((p, n) => n.views - p.views)
      }
    })
  }

  AddProject() {
    document.getElementById('add-project-btn').click();
  }

}
