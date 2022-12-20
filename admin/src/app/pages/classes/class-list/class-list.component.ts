import { Component, OnInit } from '@angular/core';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { Session, SessionType } from '@core/models/sessions/types';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SessionModel } from '@core/models/sessions';
import { Notify } from '@core/lib/alert';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';

const ADD_SESSION = 'Add Session';

@UnsubscribeOnDestroy()
@Component({
  selector: 'class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css'],
})
export class ClassListComponent implements OnInit {
  public sessions: Session[] = [];
  private sessionSubs$: Subscription;
  public showLoader: boolean = false;

  public sessionModalConfig: ModalConfig = {
    heading: ADD_SESSION,
    show: false,
    onClose: () => {
      this.sessionService.deselect();
      this.sessionModalConfig.show = false;
    },
  };

  public viewSessionModalConfig: ModalConfig = {
    heading: '',
    show: false,
    onClose: () => {
      this.sessionService.deselect();
      this.viewSessionModalConfig.show = false;
    },
  };

  public attachFileSessionModalConfig: ModalConfig = {
    heading: '',
    show: false,
    onClose: () => {
      this.sessionService.deselect();
      this.attachFileSessionModalConfig.show = false;
    },
  };

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.fetchUpcomingSessions();
    this.subscribeToSessions();
  }

  fetchAllSessions() {
    this.showLoader = true;
    this.sessionService.refreshSession();
  }

  fetchUpcomingSessions() {
    this.showLoader = true;
    this.sessionService.fetchUpcomingSessions();
  }

  fetchPastSessions() {
    this.showLoader = true;
    this.sessionService.fetchPastSessions();
  }

  handleFilter(sessionType: SessionType) {
    if (sessionType === 'upcoming') this.fetchUpcomingSessions();
    else if (sessionType === 'past') this.fetchPastSessions();
    else if (sessionType === 'video') this.sessionService.fetchVideoSessions();
    else this.fetchAllSessions();
  }

  private subscribeToSessions() {
    this.sessionSubs$ = this.sessionService.sessionCollection.subscribe(
      (sessionModels: SessionModel[]) => {
        this.showLoader = false;
        if (sessionModels) {
          this.sessions = sessionModels.map((m) => m.pluckAll());
        }
      }
    );
  }

  public handleAdd() {
    this.sessionModalConfig.show = true;
    this.sessionModalConfig.heading = ADD_SESSION;
  }

  handleEdit(session: Session) {
    this.sessionService.select(session);
    this.sessionModalConfig.show = true;
    this.sessionModalConfig.heading = session.name;
  }

  handleView(session: Session) {
    this.sessionService.select(session);
    this.viewSessionModalConfig.heading = session.name;
    this.viewSessionModalConfig.show = true;
  }

  handleAttachFile(session: Session) {
    this.sessionService.select(session);
    this.attachFileSessionModalConfig.heading = session.name + ' - Resources';
    this.attachFileSessionModalConfig.show = true;
  }

  handleDelete(sessionId: string) {
    Notify.confirm({
      message: 'Session will be deleted permanently.',
      callback: () => {
        this.sessionService.delete(sessionId);
      },
    });
  }
}
