import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Notify } from '@core/lib/alert';
import { SessionModel } from '@core/models/sessions';
import { Session } from '@core/models/sessions/types';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'attach-session-file',
  templateUrl: './attach-session-file.component.html',
  styleUrls: ['./attach-session-file.component.css'],
})
export class AttachSessionFileComponent implements OnInit {
  @Input() closeModal: () => void;

  public selectedSession: Session;
  private sessionSubs$: Subscription;

  public selectedFile: File | undefined;
  public fileDownloadedUrl: string | undefined;
  public uploadProgress: number = 0;
  public showProgress: boolean = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionSubs$ = this.sessionService.selectedSession$.subscribe(
      (session) => {
        if (session) {
          this.selectedSession = session;
        }
      }
    );
  }

  public onSelectFile(files: File[]) {
    const [file] = files;
    this.selectedFile = file;
  }

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  handleUpload() {
    if (!this.selectedFile) return;
    this.showProgress = true;
    SessionModel.uploadSessionResource(
      this.selectedFile,
      async ([percent, downloadedUrl]) => {
        this.uploadProgress = percent;
        if (percent === 100 && downloadedUrl) {
          this.showProgress = false;
          this.uploadProgress = 0;
          const files: Session['attachedFiles'] = [
            {
              name: (document.getElementById('file-name') as any)?.value || '',
              url: downloadedUrl as string,
            },
            ...(this.selectedSession.attachedFiles || []),
          ];
          this.selectedSession.attachedFiles = files;
          this.sessionService.set(
            this.selectedSession.id,
            'attachedFiles',
            files
          );
          this.closeModal();
        }
      }
    );
  }


  handleRemove(index: number) {
    Notify.confirm({
      message: 'This file will be deleted permanently.',
      callback: () => {
        const files = this.selectedSession.attachedFiles.filter((f, i) => i !== index);
        const {id} =  this.selectedSession 
        this.sessionService.set(id, 'attachedFiles', files);
        this.selectedSession.attachedFiles = files;
      }
    })
  }
}
