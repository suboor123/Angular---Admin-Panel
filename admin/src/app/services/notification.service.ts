import { Injectable } from '@angular/core';
import { FirebaseSdk } from '@core/api';
import { Entites } from '@core/common/types';
import { NotificationModel } from '@core/models/notification';
import { INotification } from '@core/models/notification/types';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { handleError } from './service-helper';

const LIMIT = 500;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  private notificationSubject$: BehaviorSubject<NotificationModel[]> =
    new BehaviorSubject<NotificationModel[]>([]);

  public notificationCollection: Observable<NotificationModel[]> =
    this.notificationSubject$.asObservable();

  private notifications: INotification[] = [];

  refreshNotifications() {
    from<Promise<NotificationModel[]>>(
      NotificationModel.syncAllNotifications()
    ).subscribe((notificationModels: NotificationModel[]) => {
      if (notificationModels) {
        this.notificationSubject$.next(notificationModels);
        this.notifications = notificationModels.map((model) =>
          model.pluckAll()
        );
        this.deleteOldNotifications();
      }
    }, handleError);
  }

  private unreadNotificationSubject$: BehaviorSubject<NotificationModel[]> =
    new BehaviorSubject<NotificationModel[]>([]);

  public unreadNotificationCollection: Observable<NotificationModel[]> =
    this.unreadNotificationSubject$.asObservable();

  private unreadNotifications: INotification[] = [];

  syncUnreadNotification() {
    from<Promise<NotificationModel[]>>(
      NotificationModel.syncUnreadNotification()
    ).subscribe((notificationModels: NotificationModel[]) => {
      if (notificationModels) {
        this.unreadNotificationSubject$.next(notificationModels);
        this.unreadNotifications = notificationModels.map((model) =>
          model.pluckAll()
        );
      }
    }, handleError);
  }

  clearAll() {
    FirebaseSdk.database(Entites.Notifications).setEntity(null);
    this.notificationSubject$.next([]);
    this.unreadNotificationSubject$.next([]);
  }

  markAsRead(notification: INotification) {
    NotificationModel.markAsRead(notification);
  }

  private deleteOldNotifications() {
    if (this.notifications.length > LIMIT) {
      const notifications = this.notifications.slice(LIMIT);
      notifications.forEach((n) => {
        NotificationModel.delete(n.id);
      });
    }
  }
}
