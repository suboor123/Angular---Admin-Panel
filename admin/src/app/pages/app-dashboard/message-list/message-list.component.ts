import { Component, OnInit } from '@angular/core';
import { Notify } from '@core/lib/alert';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages = [];

  d = new Date().toISOString();

  constructor(private ms: MessageService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.ms.refreshMessages();
    this.ms.messageCollection.subscribe((msg) => {
      if (msg) {
        this.messages = (msg || []).reverse();
      }
    });
  }

  handleClearMessages() {
    Notify.confirm({
      message: 'Are you sure you want to clear all messages',
      callback: () => {
        this.ms.clearAllMessages();
        this.toastr.success('Deleted successfully.');
      },
    });
  }

  toggleSeen(e, message) {
    const hasSeen = e.target.checked;
    message.seen = hasSeen;
    this.ms.markAsRead(message);
  }

  handleReadAll() {
    this.messages.forEach((message) => {
      if(!message.seen) {
        message.seen = true;
        this.ms.markAsRead(message);
      }
    });
  }
}
