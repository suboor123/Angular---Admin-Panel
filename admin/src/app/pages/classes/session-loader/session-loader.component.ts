import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'session-loader',
  templateUrl: './session-loader.component.html',
  styleUrls: ['./session-loader.component.css']
})
export class SessionLoaderComponent implements OnInit {

  counts = new Array().fill(1, 0, 3)

  constructor() { }

  ngOnInit(): void {
  }

}
