import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { TagModel } from '@core/models/tags';
import { Tag } from '@core/models/tags/types';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';

type DropdownOption = {
  id: string;
  label: string;
};

@UnsubscribeOnDestroy()
@Component({
  selector: 'tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css'],
})
export class TagSelectorComponent implements OnInit {
  @Input() selectedTagIds: string[];
  @Input() onSelect: (options: string[]) => void = () => {};

  dropdownList: DropdownOption[] = [];
  selectedItems: DropdownOption[] = [];
  dropdownSettings: IDropdownSettings = {};

  private tagSubscription$: Subscription;

  constructor(private tagService: TagsService) {}

  ngOnInit(): void {
    this.addDrodownOptions();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'label',
      selectAllText: 'Select all tags',
      unSelectAllText: 'Deselect all',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }

  public addDrodownOptions() {
    this.tagService.refreshTags();
    this.tagSubscription$ = this.tagService.tagsCollection.subscribe(
      (tagModels: TagModel[]) => {
        const tags: Tag[] = tagModels.map((m) => m.pluckAll());
        this.dropdownList = tags.map((t) => ({
          id: t.id,
          label: t.name,
        }));

        this.populateSelected();
      }
    );
  }

  public populateSelected() {
    if (this.selectedTagIds.length) {
      const selected = this.dropdownList.filter((option) =>
        this.selectedTagIds.some((id) => option.id === id)
      );
      this.selectedItems = selected;
    }
  }

  private refreshParentOptions(options: DropdownOption[]) {
    const optionValues: string[] = options.map((o) => o.id);
    this.onSelect(optionValues);
  }

  public onSelectTag(tag: DropdownOption) {
    this.refreshParentOptions(this.selectedItems);
  }

  public onSelectAll(tags: DropdownOption[]) {
    this.refreshParentOptions(tags);
  }

  public onDeselectTag(tag: Tag) {
    const removeDeselected = this.selectedItems.filter((t) => t.id !== tag.id);
    this.refreshParentOptions(removeDeselected);
  }

  public onDeSelectAll(tags: DropdownOption[]) {
    this.refreshParentOptions([]);
  }
}
