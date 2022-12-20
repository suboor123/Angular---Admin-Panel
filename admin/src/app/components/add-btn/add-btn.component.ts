import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'add-btn',
  templateUrl: './add-btn.component.html',
  styleUrls: ['./add-btn.component.css']
})
export class AddBtnComponent implements OnInit {

  @Input() text: string = '';
  @Input() onClick: () => void = () => {}

  constructor() { }

  ngOnInit(): void {
  }

}
