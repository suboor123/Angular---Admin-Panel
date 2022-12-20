import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TagModel } from '@core/models/tags';
import { Profile } from '@core/models/profile/types';
import { SkillLevelTypes, SkillsLevel, Tag } from '@core/models/tags/types';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile.service';
import { TagsService } from 'src/app/services/tags.service';
import { validateTagsForm, validateUpdateTagForm } from './helper';

@Component({
  selector: 'tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.css'],
})
export class TagFormComponent implements OnInit, AfterViewInit {
  @Input() onClose: () => void;

  public imageFile: File | undefined;
  public imageUrl: string | undefined;
  public imageUploadProgress: number = 0;
  public showProgress: boolean = false;
  public userProfile: Profile;
  public SkillLevelOption = Object.values(SkillsLevel);
  public isEditMode: boolean = false;
  private selectedTag: Tag | undefined;

  @ViewChild('name') name: ElementRef;
  @ViewChild('level') level: ElementRef;
  @ViewChild('desc') description: ElementRef;

  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
    private tagService: TagsService
  ) {}

  ngAfterViewInit(): void {
    this.subscribeIfEdit();
  }

  ngOnInit(): void {
    this.profileService.profileCollection.subscribe((profileModel) => {
      this.userProfile = profileModel.pluckAll();
    });

    this.tagService.selectedTag$.subscribe((tag) => {
      if (tag) {
        this.selectedTag = tag;
        this.isEditMode = true;
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

  public handleSubmit(
    name: string,
    description: string,
    level: SkillLevelTypes
  ) {
    if (this.isEditMode) {
      this.updateTag();
      return;
    }

    const { hasError, errors } = validateTagsForm(
      name,
      description,
      level,
      this.imageFile
    );
    if (hasError) {
      this.displayErrors(errors);
      return;
    }

    if (!hasError) {
      this.showProgress = true;
      if (!this.isEditMode) {
        this.createTag(name, description, level);
      }
    }
  }

  createTag(name: string, description: string, level: SkillLevelTypes) {
    TagModel.uploadTagImage(
      this.imageFile,
      async ([percent, downloadedUrl]) => {
        this.imageUploadProgress = percent;
        if (percent === 100 && downloadedUrl) {
          const tag: Tag = {
            name,
            description,
            imageUrl: downloadedUrl,
            level,
          };

          this.tagService.create(tag);
          this.showProgress = false;
          this.imageUploadProgress = 0;
          this.onClose();
        }
      }
    );
  }

  subscribeIfEdit(): void {
    this.tagService.selectedTag$.subscribe((tag) => {
      if (tag) {
        this.name.nativeElement.value = tag.name;
        this.description.nativeElement.value = tag.description;
        this.level.nativeElement.value = tag.level;
      }
    });
  }

  updateTag() {
    const name = this.name.nativeElement.value;
    const description = this.description.nativeElement.value;
    const level = this.level.nativeElement.value;

    const { hasError, errors } = validateUpdateTagForm(
      name,
      description,
      level
    );

    if (hasError) {
      this.displayErrors(errors);
      return;
    }

    if (!hasError) {
      const { id, imageUrl } = this.selectedTag;
      const tag: Tag = {
        id,
        name,
        description,
        level,
        imageUrl,
      };
      this.tagService.update(tag);
      this.onClose();
    }
  }

  private displayErrors(errors: string[]) {
    errors.forEach((err) => this.toastr.error(`Invalid Field ${err}`));
  }
}
