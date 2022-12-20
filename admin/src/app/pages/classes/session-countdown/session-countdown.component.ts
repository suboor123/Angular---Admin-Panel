import { Component, Input, OnInit } from '@angular/core';
import { SessionModel } from '@core/models/sessions';
import { Session } from '@core/models/sessions/types';
import { DateUtils } from '@core/utils/Date'

@Component({
  selector: 'session-countdown',
  templateUrl: './session-countdown.component.html',
  styleUrls: ['./session-countdown.component.css'],
})
export class SessionCountdownComponent implements OnInit {
  @Input() session: Session | undefined;

  constructor() {}

  public countDownConfig = {
    format: 'd HH:mm:ss',
    prettyText: (text) => {
      const [day, time] = text.split(' ');
      const [hour, minutes, seconds] = time.split(':');

      if (seconds == '00' && minutes == '00' && hour == '00') {
        return `<span class="badge light badge-secondary badge-xl">Streaming LIVE</span>`;
      }

      const getBadgeColor = () => {
        if (hour == '00' && day == 1) {
          return `danger`;
        }

        return 'primary';
      };

      return `
      <span class="badge light badge-${getBadgeColor()}  badge-xl">
      ${hour == '00' && day == 1 ? 'Starts in' : ''}

      ${day == 1 ? '' : day + ' days(s)'} ${
        hour == '00' ? '' : hour + ' hour'
      }  

      ${minutes == '00' ? '' : minutes + ' minutes'} 

      ${
        seconds == '00' && minutes == '00' && hour == '00'
          ? 'Streaming Live'
          : seconds + ' seconds'
      }</span> `;
    },
  };

  get timerEndTime() {
    const endDate = new Date(
      this.session.date + ' ' + this.session.sessionTiming.start
    );
    const startDate = new Date();
    return DateUtils.dateDifferenceToSeconds(startDate, endDate)
  }

  get isClassOver() {
    const sm = SessionModel.make(this.session);
    return sm.isPastSession;
  }

  ngOnInit(): void {
    this.countDownConfig['leftTime'] = this.timerEndTime;
  }
}
