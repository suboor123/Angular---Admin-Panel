import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { MessageService } from 'src/app/services/message.service';
import { ProjectService } from 'src/app/services/project.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'entity-count',
  templateUrl: './entity-count.component.html',
  styleUrls: ['./entity-count.component.css'],
})
export class EntityCountComponent implements OnInit {
  /**
   * Subscriptions
   */
  private projectSubs$: Subscription;
  private blogSubs$: Subscription;
  private sessionSubs$: Subscription;

  /**
   * Entity Count
   */
  public projectCount: number = 0;
  public blogCount: number = 0;
  public sessionCount: number = 0;
  public messageCount: number = 0;

  constructor(
    private projectService: ProjectService,
    private blogService: BlogService,
    private sessionService: SessionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchBlogs();
    this.fetchProjects();
    this.fetchUpcomingSessions()
  }

  private fetchProjects() {
    this.projectService.refreshProjects();
    this.projectSubs$ = this.projectService.projectsCollection.subscribe(
      (projectModels) => {
        if (projectModels) {
          this.projectCount = projectModels.length;
        }
      }
    );
  }

  private fetchBlogs() {
    this.blogService.refreshBlogs();
    this.blogSubs$ = this.blogService.blogCollection.subscribe(
      (blogModels) => {
        if (blogModels) {
          this.blogCount = blogModels.length;
        }
      }
    );
  }

  private fetchUpcomingSessions() {
    this.sessionService.fetchUpcomingSessions();
    this.sessionSubs$ = this.sessionService.sessionCollection.subscribe(
      (sessionModels) => {
        if (sessionModels) {
          this.sessionCount = sessionModels.filter(sm => !sm.isPastSession).length;
        }
      }
    );
  }


}
