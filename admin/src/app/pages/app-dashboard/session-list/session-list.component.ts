import { Component, OnInit } from '@angular/core';
import { Session } from '@core/models/sessions/types';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  public sessionModalConfig: ModalConfig = {
    heading: 'ADD SESSION',
    show: false,
    onClose: () => {
      this.sessionService.deselect();
      this.sessionModalConfig.show = false;
    },
  };

  sessionSubs$: Subscription;
  sessions: Session[] = [];
  showLoadMore = true;

  constructor(private sessionService: SessionService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.sessionService.fetchUpcomingSessions();
    this.sessionSubs$ = this.sessionService.sessionCollection.subscribe((sessionModel) => {
      this.sessions = sessionModel.map(m => m.pluckAll())
    })
  }

  viewUpcoming() {
    this.sessionService.fetchUpcomingSessions();
    this.showLoadMore = true;
     this.toastr.success('Showing upcoming LIVE sessions');
  }

  viewAll() {
    this.sessionService.refreshSession();
    this.showLoadMore = false;
    this.toastr.success('Showing all LIVE sessions');
  }

  AddSession() {
    this.sessionModalConfig.show = true;
  }

}
