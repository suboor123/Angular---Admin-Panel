import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() heading: string = '';
  @Input() headers: string[] = [];
  @Input() onAddClick: () => {};
  @Input() addBtnText: string = 'Add'
  @Input() records: number = 0

  constructor() { }

  ngOnInit(): void {
  }

}
