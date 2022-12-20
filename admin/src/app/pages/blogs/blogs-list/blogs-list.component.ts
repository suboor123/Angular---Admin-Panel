import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Notify } from '@core/lib/alert';
import { BlogModel } from '@core/models/blogs';
import { Blog } from '@core/models/blogs/types';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { ReorderData, Reorderitem } from 'src/app/components/reorder/reorder.types';
import { BlogService } from 'src/app/services/blog.service';

const ADD_BLOG = 'Add Blog';

@UnsubscribeOnDestroy()
@Component({
  selector: 'blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.css'],
})
export class BlogsListComponent implements OnInit {
  public blogs: Blog[] = [];
  private blogSubs$: Subscription;
  private selectedBlogSubs$: Subscription;
  public selectedBlog: Blog | undefined;

  public blogModalConfig: ModalConfig = {
    heading: ADD_BLOG,
    show: false,
    onClose: () => {
      this.blogService.deselect();
      this.blogModalConfig.show = false;
    },
  };

  public viewBlogModalConfig: ModalConfig = {
    heading: '',
    show: false,
    onClose: () => {
      this.viewBlogModalConfig.show = false;
    },
  };

  constructor(private blogService: BlogService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.blogService.refreshBlogs();
    this.blogSubs$ = this.blogService.blogCollection.subscribe(
      (blogModels: BlogModel[]) => {
        if (blogModels) {
          this.blogs = blogModels.map((m) => m.pluckAll());
        }
      }
    );

    this.selectedBlogSubs$ = this.blogService.selectedBlog$.subscribe(
      (blog: Blog | undefined) => {
        this.selectedBlog = blog;
      }
    );
  }

  public handleAdd() {
    this.blogModalConfig.show = true;
    this.blogModalConfig.heading = ADD_BLOG;
  }

  public handleDelete(blogId: string) {
    Notify.confirm({
      message: 'Blog will be deleted permanently',
      callback: () => {
        this.blogService.delete(blogId);
      },
    });
  }

  public handleEdit(blog: Blog) {
    this.blogService.select(blog);
    this.blogModalConfig.heading = blog.name;
    this.blogModalConfig.show = true;
  }

  public handleView(blog: Blog) {
    this.blogService.select(blog);
    this.viewBlogModalConfig.heading = blog.name || '';
    this.viewBlogModalConfig.show = true;
  }

  public handleCloseViewModal() {
    this.viewBlogModalConfig.show = false;
    this.blogService.deselect();
  }

  public reorderData: ReorderData = [];

  public setReorderData() {
    this.reorderData = this.blogs.map((blog) => {
      return {
        id: blog.id,
        name: blog.name,
        imageUrl: blog.imageUrl,
        sideContent: '',
      };
    });
  }


  public reorderItem(item: Reorderitem, list: ReorderData): void {
    list.splice(list.indexOf(item as any), 1);
    this.reorderData = list;
  }

  onReorder() {
    const blogs = [];

    this.reorderData.forEach((item) => {
      blogs.push(this.blogs.find((blog) => item.id === blog.id));
    });

    blogs.forEach((project, index) => {
      project.pos = index + 1;
      this.blogService.changePosition(project);
    });

    this.toastr.success('Successfully saved');
    this.blogs = [...blogs];
  }
}
