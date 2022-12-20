import { Component, Input, OnInit } from '@angular/core';
import { PROFILE_IMAGE_PLACEHOLDER } from '@core/common/constants';
import { ProfileModel } from '@core/models/profile';
import { Profile } from '@core/models/profile/types';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'edit-cover-image',
  templateUrl: './edit-cover-image.component.html',
  styleUrls: ['./edit-cover-image.component.css']
})
export class EditCoverImageComponent implements OnInit {

  @Input() onClose: () => void = () => {};
  @Input() userProfile: Profile;

  public coverImage: string = PROFILE_IMAGE_PLACEHOLDER;
  public coverImageFile: File | undefined;
  public imageUploadProgress: number = 10;
  public showProgress: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.coverImage = this.userProfile.coverImageUrl;
  }

  public handleChooseImage(files: File[]) {
    const [file] = files;
    this.coverImageFile = file;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      this.coverImage = e.target.result as string;
    };
  }

  public handleUpload() {
    if (this.coverImageFile) {
      this.showProgress = true;
      ProfileModel.uploadProfileImage(
        this.coverImageFile,
        async ([percent, downloadedUrl]) => {
          this.imageUploadProgress = percent;
          if (percent === 100 && downloadedUrl) {
            this.profileService.set('coverImageUrl', downloadedUrl);
            this.onClose();
            this.showProgress = false;
            this.imageUploadProgress = 0;
          }
        }
      );
    }
  }

}
