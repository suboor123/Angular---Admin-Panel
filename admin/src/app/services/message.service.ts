import { Injectable } from '@angular/core';
import { FirebaseSdk } from '@core/api';
import { Entites } from '@core/common/types';
import { BehaviorSubject, from } from 'rxjs';

interface Message {
  email: string;
  message: string;
  name: string;
  seen: boolean;
  id: string;
  createdAt: string;
}

type VisitorType = 'suboor' | 'prashant';

export interface Visitor {
  city: string;
  country: string;
  date: string;
  ip: string;
  visitorType: VisitorType;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messageCollection = new BehaviorSubject<Message[]>([]);

  constructor() {}

  refreshMessages() {
    from(FirebaseSdk.database(Entites.Contact).syncAll()).subscribe(
      (messages: Message[]) => {
        if (messages) {
          this.messageCollection.next(messages);
        }
      }
    );
  }

  clearAllMessages() {
    FirebaseSdk.database(Entites.Contact).setEntity(null);
    this.messageCollection.next([]);
  }

  markAsRead(message: Message) {
    FirebaseSdk.database<Message>(Entites.Contact).updateChild(
      message.id,
      'seen',
      message.seen
    );
    this.refreshMessages();
  }

  public visitorCollection = new BehaviorSubject<Visitor[]>([]);
  refreshVisitors() {
    from(FirebaseSdk.database(Entites.Visitor).syncAll()).subscribe(
      (visitors: Visitor[]) => {
        if (visitors) {
          const v = visitors.reverse();
          this.visitorCollection.next(v);
        }
      }
    );
  }
}
