import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Session } from '@core/models/sessions/types';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/services/session.service';
import { validateSessionForm } from './helper';
import { SessionModel } from '@core/models/sessions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.css'],
})
export class SessionFormComponent implements OnInit, AfterViewInit {
  @Input() onClose: () => void = () => {};

  public imageFile: File | undefined;
  public imageUrl: string | undefined;
  public imageUploadProgress: number = 0;
  public showProgress: boolean = false;
  public content: string = '';
  public tagIds: string[] = [];
  public isEditMode: boolean = false;

  private selectedSessionSubs$: Subscription;
  public selectedSession: Session | undefined;

  @ViewChild('name') name: ElementRef;
  @ViewChild('desc') description: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;
  @ViewChild('url') url: ElementRef;
  @ViewChild('videoUrl') videoUrl: ElementRef;

  constructor(
    private toastr: ToastrService,
    private sessionService: SessionService
  ) {}

  ngAfterViewInit(): void {
    if (this.selectedSession && this.isEditMode) {
      this.name.nativeElement.value = this.selectedSession.name;
      this.description.nativeElement.value = this.selectedSession.description;
      this.url.nativeElement.value = this.selectedSession.url;
      this.imageUrl = this.selectedSession.imageUrl;
      this.date.nativeElement.value = this.selectedSession.date;
      this.startTime.nativeElement.value =
        this.selectedSession.sessionTiming.start;
      this.endTime.nativeElement.value = this.selectedSession.sessionTiming.end;
      this.videoUrl.nativeElement.value = this.selectedSession.videoUrl || ''
    }
  }

  ngOnInit(): void {
    this.selectedSessionSubs$ = this.sessionService.selectedSession$.subscribe(
      (session) => {
        if (session) {
          this.isEditMode = true;
          this.selectedSession = session;
          this.tagIds = session.tags as string[];
        }
      }
    );
  }

  public handleChooseImage(files: File[]) {
    const [file] = files;
    this.imageFile = file;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      this.imageUrl = e.target.result as string;
    };
  }

  public getContent(content: string) {
    this.content = content;
  }

  public onSelectTags(tagIds: string[]) {
    this.tagIds = tagIds;
  }

  public addEmbedUrl(): void {
    this.videoUrl.nativeElement.value = 'https://www.youtube.com/embed/'
  }

  get formValues() {
    return {
      name: this.name.nativeElement.value,
      description: this.description.nativeElement.value,
      date: this.date.nativeElement.value,
      startTime: this.startTime.nativeElement.value,
      endTime: this.endTime.nativeElement.value,
      url: this.url.nativeElement.value,
    };
  }

  public handleSubmit() {
    const { name, description, date, startTime, endTime } = this.formValues;

    if (!this.isEditMode) {
      const { hasErrors, errors } = validateSessionForm(
        name,
        description,
        date,
        startTime,
        endTime,
        this.imageFile
      );

      if (hasErrors) {
        errors.forEach((err) => {
          this.toastr.error(`Invalid Field ${err}`);
        });
        return;
      }
      this.uploadSessionImage();
    } else {
      this.updateSession();
    }
  }

  public uploadSessionImage() {
    this.showProgress = true;
    SessionModel.uploadSessionImage(
      this.imageFile,
      async ([percent, downloadedUrl]) => {
        this.imageUploadProgress = percent;
        if (percent === 100 && downloadedUrl) {
          this.createSession(downloadedUrl);
          this.showProgress = false;
          this.imageUploadProgress = 0;
          this.onClose();
        }
      }
    );
  }

  public createSession(imageUrl: string) {
    const { name, description, date, startTime, endTime, url } =
      this.formValues;
    const session: Session = {
      description,
      views: 0,
      tags: this.tagIds || [],
      url: url, // of course I know the shorthand syntax of ES6 but I just want my code to look cleaner
      sessionTiming: {
        start: startTime,
        end: endTime,
      },
      date: date,
      name: name,
      imageUrl: imageUrl,
      createdAt: new Date().toDateString(),
      videoUrl: this.videoUrl.nativeElement.value
    };

    this.sessionService.create(session);
  }

  updateSession() {
    const { name, description, date, startTime, endTime, url } =
      this.formValues;
    const session: Session = {
      ...this.selectedSession,
      description,
      tags: this.tagIds || [],
      url: url,
      sessionTiming: {
        start: startTime,
        end: endTime,
      },
      date: date,
      name: name,
      videoUrl: this.videoUrl.nativeElement.value
    };

    this.sessionService.update(session);
    this.onClose();
  }
}
