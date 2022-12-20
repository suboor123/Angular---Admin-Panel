import { Component, Input, OnInit } from '@angular/core';
import { SessionModel } from '@core/models/sessions';
import { Session } from '@core/models/sessions/types';
import { Tag } from '@core/models/tags/types';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.css']
})
export class SessionCardComponent implements OnInit {

  @Input() session: Session | undefined;
  @Input() hasActionButtons: boolean;
  @Input() editClick: (session: Session) => void;
  @Input() viewClick: (session: Session) => void;
  @Input() deleteClick: (id: string) => void;
  @Input() attachFileClick: (id: string) => void;

  public sessionTags: Tag[] = [];
  public showJoinBtn: boolean = false;

  constructor(private tagService: TagsService) { }

  ngOnInit(): void {
    if (this.session.tags.length) {
      this.sessionTags = this.tagService.tagListByTagIds(
        this.session.tags as string[]
      );
    }

    const sessionModel = SessionModel.make(this.session);
    this.showJoinBtn = !sessionModel.isPastSession;
  }

}
