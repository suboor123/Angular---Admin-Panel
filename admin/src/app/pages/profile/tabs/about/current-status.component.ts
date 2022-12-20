import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Profile } from '@core/models/profile/types';
import { ProjectModel } from '@core/models/projects';
import { Project } from '@core/models/projects/types';
import { TagModel } from '@core/models/tags';
import { Tag } from '@core/models/tags/types';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { TagsService } from 'src/app/services/tags.service';
import { ProfileService } from '../../../../services/profile.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'current-status',
  templateUrl: './current-status.component.html',
  styleUrls: ['./current-status.component.css'],
})
export class CurrentStatusComponent implements OnInit, OnDestroy {
  userProfile: Profile | undefined;
  userSkills: Tag[] = [];
  userProjects: Project[] = []

  userProfileSubscription$: Subscription;
  userSkillsSubscription$: Subscription;
  projectSubs$: Subscription;

  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
    private tagService: TagsService,
    private projectService: ProjectService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getUserSkills();
    this.getUserprojects();
  }

  getUserProfile(): void {
    this.profileService.refreshProfile();
    this.userProfileSubscription$ =
      this.profileService.profileCollection.subscribe((profileModel) => {
        if (profileModel) {
          this.userProfile = profileModel.pluckAll();
        }
      });
  }

  getUserSkills(): void {
    this.tagService.refreshTags();
    this.userSkillsSubscription$ = this.tagService.tagsCollection.subscribe(
      (tagModels: TagModel[]) => {
        if (tagModels) {
          this.userSkills = tagModels.map((m) => m.pluckAll());
        }
      }
    );
  }

  getUserprojects(): void {
    this.projectService.refreshProjects();
    this.projectSubs$ = this.projectService.projectsCollection.subscribe(
      (projectModels: ProjectModel[]) => {
        if(projectModels) {
          this.userProjects = projectModels.map(m => m.pluckAll()).slice(0, 4);
        }
      }
    );
  }

  handleStatusChange(status: string): void {
    if (!status || !status.trim().length) {
      this.toastr.error('Invalid values');
      return;
    }
    this.profileService.set('status', status);
    this.toastr.success('Status changed successfully.');
  }
}
