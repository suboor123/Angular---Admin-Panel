import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Project } from '@core/models/projects/types';
import { Tag } from '@core/models/tags/types';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project | undefined;
  @Input() hasActionButtons: boolean;
  @Input() editClick: (project: Project) => void;
  @Input() viewClick: (project: Project) => void;
  @Input() deleteClick: (id: string) => void;

  projectTags: Tag[] = [];

  constructor(private tagService: TagsService) {}

  ngOnInit(): void {
    if (this.project.tags.length) {
      this.projectTags = this.tagService.tagListByTagIds(
        this.project.tags as string[]
      );
    }
  }
}
