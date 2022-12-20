import { Injectable } from '@angular/core';
import { echo } from '@core/lib/echo';
import { SessionModel } from '@core/models/sessions';
import { Session } from '@core/models/sessions/types';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { handleError } from './service-helper';
import { TagsService } from './tags.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionSubject$: BehaviorSubject<SessionModel[]> =
    new BehaviorSubject<SessionModel[]>([]);

  public sessionCollection: Observable<SessionModel[]> =
    this.sessionSubject$.asObservable();

  private sessions: Session[] = [];

  public selectedSession$: BehaviorSubject<Session> = new BehaviorSubject<
    Session | undefined
  >(undefined);

  constructor(private toastr: ToastrService, private tagService: TagsService) {}

  refreshSession() {
    from<Promise<SessionModel[]>>(SessionModel.sync()).subscribe(
      (sessionModels: SessionModel[]) => {
        if (sessionModels) {
          this.sessionSubject$.next(sessionModels);
          this.sessions = sessionModels.map((model) => model.pluckAll());
        }
      },
      handleError
    );
  }

  create(session: Session) {
    SessionModel.create(session);
    this.refreshSession();
    this.toastr.success('Successfully Saved.');
  }

  delete(sessionId: string) {
    SessionModel.delete(sessionId);
    this.sessions = this.sessions.filter((session) => session.id !== sessionId);
    this.sessionSubject$.next(
      this.sessions.map((s) => SessionModel.make(s)) || []
    );
    this.toastr.success('Deleted successfully.');
  }

  update(session: Session) {
    SessionModel.update(session);
    this.sessions.forEach((sess, i) => {
      if (sess.id === sess.id) {
        this.sessions[i] = sess;
      }
    });
    this.sessionSubject$.next(
      this.sessions.map((s) => SessionModel.make(s)) || []
    );
    this.toastr.success('Successfully Saved.');
  }

  select(session: Session) {
    this.selectedSession$.next(session);
  }

  deselect() {
    this.selectedSession$.next(undefined);
  }

  fetchUpcomingSessions() {
    from<Promise<SessionModel[]>>(
      SessionModel.syncUpcomingSessions()
    ).subscribe((sessionModels: SessionModel[]) => {
      if (sessionModels) {
        echo('*** Fetches upcoming sessions ****', sessionModels)
        this.sessionSubject$.next((sessionModels || []));
        this.sessions = sessionModels.map((model) => model.pluckAll());
      }
    }, handleError);
  }

  fetchPastSessions() {
    from<Promise<SessionModel[]>>(
      SessionModel.syncPastSessions()
    ).subscribe((sessionModels: SessionModel[]) => {
      if (sessionModels) {
        echo('*** Fetches past sessions ****', sessionModels)
        this.sessionSubject$.next((sessionModels || []).reverse());
        this.sessions = sessionModels.map((model) => model.pluckAll());
      }
    }, handleError);
  }

  fetchVideoSessions() {
    from<Promise<SessionModel[]>>(SessionModel.sync()).subscribe(
      (sessionModels: SessionModel[]) => {
        if (sessionModels) {
          const sessionM = sessionModels.filter(sm => sm.pluck('videoUrl'))
          this.sessionSubject$.next(sessionM);
          this.sessions = sessionModels.map((model) => model.pluckAll());
        }
      },
      handleError
    );
  }

  set<K extends keyof Session>(id: string, key: K, value: Session[K]) {
    const session = this.sessions.find(sess => sess.id === id);
    if(session) {
      const updatedSession = {...session, ...{ [key]: value }};
      this.update(updatedSession)
    }
  }

}
