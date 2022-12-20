import { Component, Input, OnInit } from '@angular/core';
import { ModalButtonText, ModalSize } from './modal.types';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() heading: string = '';
  @Input() size: ModalSize = 'lg';
  @Input() buttonText: ModalButtonText = 'Save Changes';
  @Input() onClose: () => void;
  @Input() onSave: () => void;

  constructor() { }

  ngOnInit(): void {
  }

}
