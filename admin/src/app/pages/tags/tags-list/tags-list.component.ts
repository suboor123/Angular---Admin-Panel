import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tag, TagId } from '@core/models/tags/types';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { TagsService } from 'src/app/services/tags.service';
import { Notify } from '@core/lib/alert';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Subscription } from 'rxjs';

const ADD_TAG = 'Add Tag';

@UnsubscribeOnDestroy()
@Component({
  selector: 'tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css'],
})
export class TagsListComponent implements OnInit, OnDestroy {
  public headers: string[] = ['#ID', 'Image', 'Name', 'Level', 'Action'];
  public tags: Tag[] = [];

  private tagSubscription$: Subscription;

  public tagModalConfig: ModalConfig = {
    heading: ADD_TAG,
    show: false,
    onClose: () => {
      this.tagModalConfig.show = false;
      this.tagService.deselectTag();
    },
  };

  public viewTagModalConfig: ModalConfig = {
    heading: '',
    show: false,
    onClose: () => {
      this.viewTagModalConfig.show = false;
      this.tagService.deselectTag();
    },
  };

  constructor(private tagService: TagsService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.tagService.refreshTags();
    this.tagSubscription$ = this.tagService.tagsCollection.subscribe(
      (tagModel) => {
        if (tagModel) {
          this.tags = tagModel.map((m) => m.pluckAll());
        }
      }
    );
  }

  public handleAdd(): void {
    this.tagService.deselectTag();
    this.tagModalConfig.heading = ADD_TAG;
    this.tagModalConfig.show = true;
  }

  public deleteTag(tagId: TagId) {
    Notify.confirm({
      message: 'Tag will be deleted permanently.',
      callback: () => {
        this.tagService.delete(tagId);
      },
    });
  }

  public handleView(tag: Tag) {
    this.tagService.selectTag(tag);
    this.viewTagModalConfig.heading = tag.name;
    this.viewTagModalConfig.show = true;
  }

  public handleEdit(tag: Tag) {
    this.tagService.selectTag(tag);
    this.tagModalConfig.heading = tag.name;
    this.tagModalConfig.show = true;
  }
}
