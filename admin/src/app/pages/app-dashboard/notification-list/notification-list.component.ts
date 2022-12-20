import { Component, OnInit } from '@angular/core';
import { Notify } from '@core/lib/alert';
import { INotification } from '@core/models/notification/types';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  public notifications: INotification[] = []

  constructor(private notificationService: NotificationService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.handleRefreshNotification()
  }

  handleRefreshNotification() {
    this.notifications = []
    this.notificationService.refreshNotifications();
    this.notificationService.notificationCollection.subscribe(nm => {
      if(nm) {
        this.notifications = nm.map(n => n.pluckAll());
      }
    })
  }

  handleClearAll() {
    Notify.confirm({
      message: 'Are you sure you want to clear all notifications',
      callback: () => {
        this.notificationService.clearAll();
        this.toastr.success('Deleted successfully.')
      }
    })
  }

  removeS(string: string) {
    const split = string.split('');
    split.pop();
    return split.join('')
  }

}
