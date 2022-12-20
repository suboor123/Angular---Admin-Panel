import { Component, Input, OnInit } from '@angular/core';
import { Blog } from '@core/models/blogs/types';
import { Tag } from '@core/models/tags/types';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent implements OnInit {
  @Input() blog: Blog | undefined;
  @Input() hasActionButtons: boolean;
  @Input() editClick: (blog: Blog) => void;
  @Input() viewClick: (blog: Blog) => void;
  @Input() deleteClick: (id: string) => void;

  tagSubs$: Subscription;
  blogTags: Tag[] = [];

  constructor(private tagService: TagsService) {}

  ngOnInit(): void {
    if (this.blog.tags.length) {
      this.blogTags = this.tagService.tagListByTagIds(
        this.blog.tags as string[]
      );
    }
  }
}
