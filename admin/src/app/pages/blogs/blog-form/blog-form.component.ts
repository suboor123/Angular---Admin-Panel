import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ResponseParser } from '@core/lib/parsers/response-parser';
import { BlogModel } from '@core/models/blogs';
import { Blog } from '@core/models/blogs/types';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from 'src/app/services/blog.service';
import { validateBlogForm } from './helper';

interface Legacy_blog {
  content: string;
  count: number;
  date: string;
  description: string;
  image_url: string;
  order: string;
  title: string;
}

@Component({
  selector: 'blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogFormComponent implements OnInit, AfterViewInit {
  @Input() onClose: () => void = () => {};

  public imageFile: File | undefined;
  public imageUrl: string | undefined;
  public imageUploadProgress: number = 0;
  public showProgress: boolean = false;
  public content: string = '';
  public tagIds: string[] = [];
  public isEditMode: boolean = false;
  public selectedBlog: Blog | undefined;

  @ViewChild('name') name: ElementRef;
  @ViewChild('desc') description: ElementRef;

  constructor(
    private toastr: ToastrService,
    private blogService: BlogService
  ) {}

  ngAfterViewInit(): void {
    if (this.selectedBlog && this.isEditMode) {
      this.name.nativeElement.value = this.selectedBlog.name;
      this.description.nativeElement.value = this.selectedBlog.description;
      this.imageUrl = this.selectedBlog.imageUrl;
    }
  }

  ngOnInit(): void {
    this.blogService.selectedBlog$.subscribe((blog) => {
      if (blog) {
        this.isEditMode = true;
        this.selectedBlog = blog;
        this.tagIds = blog.tags as string[];
        this.content = blog.content;
      }
    });
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
    if (this.isEditMode) {
      this.updateBlog();
    } else {
      const { hasErrors, errors } = validateBlogForm(
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
      this.uploadBlogImage();
    }
  }

  private uploadBlogImage() {
    this.showProgress = true;
    BlogModel.uploadBlogImage(
      this.imageFile,
      async ([percent, downloadedUrl]) => {
        this.imageUploadProgress = percent;
        if (percent === 100 && downloadedUrl) {
          this.createBlog(downloadedUrl);
          this.showProgress = false;
          this.imageUploadProgress = 0;
          this.onClose();
        }
      }
    );
  }

  private createBlog(imageUrl: string) {
    const blog: Blog = {
      description: this.description.nativeElement.value,
      content: this.content,
      views: 0,
      tags: this.tagIds,
      name: this.name.nativeElement.value,
      imageUrl: imageUrl,
      createdAt: new Date().toDateString(),
      comments: [],
    };

    this.blogService.create(blog);
  }

  public updateBlog() {
    const blog: Blog = {
      ...this.selectedBlog,
      description: this.description.nativeElement.value,
      content: this.content,
      tags: this.tagIds,
      name: this.name.nativeElement.value,
    };

    this.blogService.update(blog);
    this.onClose();
  }
}
