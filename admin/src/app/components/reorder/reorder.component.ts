import { Component, Input, OnInit } from '@angular/core';
import { ModalConfig } from '../modal/modal.types';
import { ReorderData, Reorderitem } from './reorder.types';

@Component({
  selector: 'reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.css'],
})
export class ReorderComponent implements OnInit {
  @Input() title: string;
  @Input() data: ReorderData = [];

  @Input() beforeReorderModalOpens: () => void | Promise<any>;
  @Input() onReorderItems: (item: Reorderitem, data: ReorderData) => void;
  @Input() onSave: () => void = () => {};


  public reorderModalConfig: ModalConfig = {
    heading: `Reorder`,
    show: false,
    onClose: () => {
      this.reorderModalConfig.show = false;
    },
  };

  public handleSave() {
    this.onSave();
    this.reorderModalConfig.onClose();
  }

  public handleOpenModal() {
    this.beforeReorderModalOpens();
    this.reorderModalConfig.show = true;
  }

  constructor() {}

  ngOnInit(): void {
    this.reorderModalConfig.heading = `Reorder ${this.title || ''}`;
  }
}
