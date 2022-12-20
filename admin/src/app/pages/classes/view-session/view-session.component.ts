import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Session } from '@core/models/sessions/types';
import { Tag } from '@core/models/tags/types';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { TagsService } from 'src/app/services/tags.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.css'],
})
export class ViewSessionComponent implements OnInit {
  @Input() onClose: () => void = () => {};

  //Subscriptions
  private selectedSessionSubs$: Subscription;
  private tagSubs$: Subscription;

  public selectedSession: Session | undefined;
  public sessionTags: Tag[] = [];

  public sessionDate = new Date().toDateString();

  constructor(
    private sessionService: SessionService,
    private tagService: TagsService
  ) {}

  ngOnInit(): void {
    this.selectedSessionSubs$ = this.sessionService.selectedSession$.subscribe(
      (session: Session) => {
        if (session) {
          this.selectedSession = session;
          this.sessionDate = new Date(
            session.date + ' ' + session.sessionTiming.start
          ).toISOString();
        }
      }
    );

    /**
     * Fetches tags of selected session
     */
    if (this.selectedSession && this.selectedSession.tags.length)
      this.sessionTags = this.tagService.tagListByTagIds(
        this.selectedSession.tags as string[]
      );
  }
}
