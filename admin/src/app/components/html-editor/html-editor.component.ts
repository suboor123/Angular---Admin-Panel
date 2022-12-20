import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ModalConfig } from '../modal/modal.types';
import { EditorConfig } from './helper';

const HEADING = 'Content Writer';
const PREVIEW = 'Preview'

@Component({
  selector: 'html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.css']
})
export class HtmlEditorComponent implements OnInit {

  @Input() getContent: (content: string) => void = () => {}
  @Input() defaultValue: string = '';

  public htmlContent: string = '';
  public editorConfig: AngularEditorConfig = EditorConfig;

  public htmlEditorModalConfig: ModalConfig = {
    heading: HEADING,
    show: false,
    onClose: () => {
      this.htmlEditorModalConfig.show = false;
    },
  }

  public previewModalConfig: ModalConfig = {
    heading: PREVIEW,
    show: false,
    onClose: () => {
      this.previewModalConfig.show = false;
    },
  }

  constructor() { }

  ngOnInit(): void {
    this.htmlContent = this.defaultValue;
  }

  public handleAdd() {
    this.htmlEditorModalConfig.show = true;
  }

  public handleSaveContent() {
    this.htmlEditorModalConfig.show = false;
    this.getContent(this.htmlContent)
  }

  public showPreview() {
    this.previewModalConfig.show = true;
    this.handleSaveContent();
  }

  public handleEditContent() {
    this.previewModalConfig.show = false;
    this.handleAdd();
  }
}
