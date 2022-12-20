import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Tag } from '@core/models/tags/types';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'view-tag',
  templateUrl: './view-tag.component.html',
  styleUrls: ['./view-tag.component.css'],
})
export class ViewTagComponent implements OnInit, OnDestroy {
  public tag: Tag | undefined;
  private subscription: Subscription;
  @Input() onClose: () => void;

  constructor(private tagService: TagsService) {}

  ngOnInit(): void {
    this.subscription = this.tagService.selectedTag$.subscribe((tag) => {
      if (tag) this.tag = tag;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
