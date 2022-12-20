import { Component, OnInit } from '@angular/core';
import { MessageService, Visitor } from 'src/app/services/message.service';

@Component({
  selector: 'visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css'],
})
export class VisitorListComponent implements OnInit {
  constructor(private service: MessageService) {}

  allVisitors: Visitor[] = [];
  visitors: Visitor[] = [];

  ngOnInit(): void {
    this.service.refreshVisitors();
    this.service.visitorCollection.subscribe((v) => {
      if (v) {
        this.restructureVisitors(v);
        this.allVisitors = v;
        this.visitors = v;
      }
    });
  }

  handleSelectVisitorType(e: any) {
    const val = e.target.value;
    switch (val) {
      case 'all':
        this.visitors = this.allVisitors;
        break;
      case 'prashant':
        this.visitors = this.allVisitors.filter(
          (v) => v.visitorType === 'prashant'
        );
        break;
      case 'suboor':
        this.visitors = this.allVisitors.filter(
          (v) => v.visitorType === 'suboor'
        );
        break;
    }
  }

  restructureVisitors(visitors: Visitor[]) {
    visitors.forEach((visitor) => {
      if (visitor.ip.includes('**PRASHANT**')) {
        visitor.visitorType = 'prashant';
      } else {
        visitor.visitorType = 'suboor';
      }
    });
  }
}
