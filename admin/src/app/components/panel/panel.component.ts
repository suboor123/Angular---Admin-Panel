import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  @Input() title: string = '';
  @Input() hasAddButton: boolean = false;
  @Input() onAddBtnClick: () => void = () => {};

  constructor() { }

  ngOnInit(): void {
  }

}
