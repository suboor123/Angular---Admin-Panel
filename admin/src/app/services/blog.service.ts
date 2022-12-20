import { Injectable } from '@angular/core';
import { Blog } from '../../../../core/models/blogs/types';
import { BlogModel } from '../../../../core/models/blogs';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogSubject$: BehaviorSubject<BlogModel[]> = new BehaviorSubject<
    BlogModel[]
  >([]);

  public blogCollection: Observable<BlogModel[]> =
    this.blogSubject$.asObservable();

  private blogs: Blog[] = [];

  public selectedBlog$: BehaviorSubject<Blog> = new BehaviorSubject<
    Blog | undefined
  >(undefined);

  constructor(private toastr: ToastrService) {}

  public create(blog: Blog): void {
    BlogModel.create(blog);
    this.refreshBlogs();
    this.toastr.success('Successfully Saved.');
  }

  public refreshBlogs(): void {
    from<Promise<BlogModel[]>>(BlogModel.makeBlogsCollection()).subscribe(
      (blogModels) => {
        if (blogModels) this.blogSubject$.next(blogModels);
        this.blogs = blogModels.map((bm) => bm.pluckAll());
      },
      handleError
    );
  }

  public delete(blogId: string) {
    BlogModel.delete(blogId);
    this.blogs = this.blogs.filter((blog) => blog.id !== blogId);
    this.blogSubject$.next(this.blogs.map((b) => BlogModel.make(b)) || []);
    this.toastr.success('Deleted successfully.');
  }

  public update(blog: Blog) {
    BlogModel.update(blog);
    this.blogs.forEach((p, i) => {
      if (p.id === blog.id) {
        this.blogs[i] = blog;
      }
    });
    this.blogSubject$.next(this.blogs.map((p) => BlogModel.make(p)) || []);
    this.toastr.success('Successfully Saved.');
  }

  public select(blog: Blog) {
    this.selectedBlog$.next(blog);
  }

  public deselect() {
    this.selectedBlog$.next(undefined);
  }

  changePosition(blog: Blog) {
    BlogModel.updateBlogPosition(blog);
  }
}
