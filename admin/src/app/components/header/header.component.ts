import { Component, OnInit } from '@angular/core';
import { Profile } from '@core/models/profile/types';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { Notify } from '@core/lib/alert';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userProfile: Profile | undefined;
  unreadNotifications = [];
  unreadNotficationCount = 0;

  unreadMessages = [];
  unreadMessageCount = 0;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private dashboard: DashboardService,
    private ns: NotificationService,
    private message: MessageService
  ) {
    router.events.subscribe((val) => {
      //Route changes
      this.closeSidebar();
      this.ns.syncUnreadNotification();
      var mq = window.matchMedia('(max-width: 570px)');
      if (window.screen.width === 360) {
        // 768px portrait
        this.closeSidebar();
      }
    });
  }

  ngOnInit(): void {
    this.profileService.refreshProfile();
    this.profileService.profileCollection.subscribe((profileModel) => {
      if (profileModel) {
        this.userProfile = profileModel.pluckAll();
      }
    });
    this.subscribeToUnreadNotifications();
    this.subscribeToMessages();
  }

  subscribeToMessages() {
    this.message.refreshMessages();
    this.message.messageCollection.subscribe((message) => {
      if (message) {
        this.unreadMessages = message.filter((m) => !m.seen);
        this.unreadMessageCount = this.unreadMessages.length;
      }
    });
  }

  subscribeToUnreadNotifications() {
    this.ns.syncUnreadNotification();
    this.ns.unreadNotificationCollection.subscribe((n) => {
      if (n) {
        this.unreadNotifications = n.map((nn) => nn.pluckAll());
        this.unreadNotficationCount = n.length;
        if(!this.unreadMessageCount) {
          this.subscribeToAllNotifications();
        }
      }
    });
  }

  subscribeToAllNotifications() {
    this.ns.refreshNotifications();
    this.ns.notificationCollection.subscribe((n) => {
      if (n) {
        this.unreadNotifications = n.slice(0,20).map((nn) => nn.pluckAll());
      }
    });
  }

  toggleSidebar() {
    const element = document.getElementById('main-wrapper');
    const hamburder = document.getElementById('hamburger');
    if (element.classList.contains('menu-toggle')) {
      element.classList.remove('menu-toggle');
      hamburder.classList.remove('is-active');
    } else {
      const element = document.getElementById('main-wrapper');
      const hamburder = document.getElementById('hamburger');
      element.classList.add('menu-toggle');
      hamburder.classList.add('is-active');
    }
  }

  //This function work only for mobile phone devices
  closeSidebar() {
    const element = document.getElementById('main-wrapper');
    const hamburder = document.getElementById('hamburger');
    element.classList.remove('menu-toggle');
    hamburder.classList.remove('is-active');
  }

  public handleLogout() {
    Notify.confirm({
      message: 'Are you sure? you want to logout',
      callback: () => {
        this.dashboard.logout();
      },
    });
  }

  openNotificaiton() {
    this.unreadNotifications.forEach((n) => {
      if (!n.seen) {
        this.ns.markAsRead(n);
      }
    });
    this.unreadNotficationCount = 0;
  }

  removeS(string: string) {
    const split = string.split('');
    split.pop();
    return split.join('');
  }
}
