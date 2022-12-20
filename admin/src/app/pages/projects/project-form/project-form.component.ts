import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { validateEditProjectForm, validateProjectForm } from './helper';
import { ProjectModel } from '@core/models/projects/index';
import { Project } from '@core/models/projects/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit, AfterViewInit {
  @Input() onClose: () => void = () => {};

  public imageFile: File | undefined;
  public imageUrl: string | undefined;
  public imageUploadProgress: number = 0;
  public showProgress: boolean = false;
  public content: string = '';
  public tagIds: string[] = [];
  public isEditMode: boolean = false;
  private selectedProjectSubs$: Subscription;
  public selectedProject: Project | undefined;

  @ViewChild('name') name: ElementRef;
  @ViewChild('level') level: ElementRef;
  @ViewChild('desc') description: ElementRef;
  @ViewChild('url') url: ElementRef;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    if (this.selectedProject && this.isEditMode) {
      this.name.nativeElement.value = this.selectedProject.name;
      this.description.nativeElement.value = this.selectedProject.description;
      this.url.nativeElement.value = this.selectedProject.url;
      this.imageUrl = this.selectedProject.imageUrl;
    }
  }

  ngOnInit(): void {
    this.selectedProjectSubs$ = this.projectService.selectedProject$.subscribe(
      (project) => {
        if (project) {
          this.selectedProject = project;
          this.isEditMode = true;
          this.tagIds = project.tags as string[];
          this.content = project.content;
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

  public handleSubmit() {
    if (!this.isEditMode) {
      const { hasErrors, errors } = validateProjectForm(
        this.name.nativeElement.value,
        this.description.nativeElement.value,
        this.imageFile,
        this.content
      );

      if (hasErrors) {
        errors.forEach((err) => {
          this.toastr.error(`Invalid Field ${err}`);
        });
        return;
      }
      this.handleAdd();
    }

    if(this.isEditMode) {
      const { hasErrors, errors } = validateEditProjectForm(
        this.name.nativeElement.value,
        this.description.nativeElement.value,
        this.content
      );

      if (hasErrors) {
        errors.forEach((err) => {
          this.toastr.error(`Invalid Field ${err}`);
        });
        return;
      }

      this.updateProject()
    }
  }

  public handleAdd() {
    this.showProgress = true;
    ProjectModel.uploadProjectImage(
      this.imageFile,
      async ([percent, downloadedUrl]) => {
        this.imageUploadProgress = percent;
        if (percent === 100 && downloadedUrl) {
          this.createProject(downloadedUrl);
          this.showProgress = false;
          this.imageUploadProgress = 0;
          this.onClose();
        }
      }
    );
  }

  public createProject(imageUrl: string) {
    const project: Project = {
      description: this.description.nativeElement.value,
      content: this.content,
      views: 0,
      tags: this.tagIds,
      url: this.url.nativeElement.value,
      name: this.name.nativeElement.value,
      imageUrl: imageUrl,
      createdAt: new Date().toDateString(),
    };

    this.projectService.create(project);
  }

  public updateProject() {
    const project: Project = {
      ...this.selectedProject,
      description: this.description.nativeElement.value,
      content: this.content,
      tags: this.tagIds,
      url: this.url.nativeElement.value,
      name: this.name.nativeElement.value,
    };

    this.projectService.update(project);
    this.onClose();
  }
}
