import { Injectable } from '@angular/core';
import { TagModel } from '@core/models/tags';
import { Tag, TagId } from '@core/models/tags/types';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private tagsSubejct$: BehaviorSubject<TagModel[]> = new BehaviorSubject<
    TagModel[]
  >([]);

  public tagsCollection: Observable<TagModel[]> =
    this.tagsSubejct$.asObservable();

  private tags: Tag[] = [];

  public selectedTag$: BehaviorSubject<Tag> = new BehaviorSubject<
    Tag | undefined
  >(undefined);

  constructor(private toastr: ToastrService) {}

  refreshTags() {
    from<Promise<TagModel[]>>(TagModel.syncTags()).subscribe(
      (tagModels: TagModel[]) => {
        if (tagModels) {
          this.tagsSubejct$.next(tagModels);
          this.tags = tagModels.map((model) => model.pluckAll());
        }
      },
      handleError
    );
  }

  create(tag: Tag) {
    TagModel.create(tag);
    this.refreshTags();
    this.toastr.success('Successfully Saved.');
  }

  push(tag: Tag) {
    this.tags.unshift(tag);
    this.tagsSubejct$.next(this.tags.map((t) => TagModel.make(t)) || []);
  }

  delete(tagId: TagId) {
    TagModel.delete(tagId);
    this.tags = this.tags.filter((tag) => tag.id !== tagId);
    this.tagsSubejct$.next(this.tags.map((t) => TagModel.make(t)) || []);
    this.toastr.success('Deleted successfully.');
  }

  selectTag(tag: Tag) {
    this.selectedTag$.next(tag);
  }

  deselectTag() {
    this.selectedTag$.next(undefined);
  }

  update(tag: Tag) {
    const updated = TagModel.update(tag);
    this.tags.forEach((t, i) => {
      if (t.id === tag.id) {
        this.tags[i] = tag;
      }
    });
    this.tagsSubejct$.next(this.tags.map((t) => TagModel.make(t)) || []);
    this.toastr.success('Successfully Saved.');
  }

  tagListByTagIds(tagIds: string[]): Tag[] {
    const tags = this.tags.filter((tag) => tagIds.some((id) => id === tag.id));
    return tags;
  }

}
