import { Component, Input, OnInit } from '@angular/core';
import { PROFILE_IMAGE_PLACEHOLDER } from '@core/common/constants';
import { ProfileModel } from '@core/models/profile';
import { Profile } from '@core/models/profile/types';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'edit-profile-image',
  templateUrl: './edit-profile-image.component.html',
  styleUrls: ['./edit-profile-image.component.css'],
})
export class EditProfileImageComponent implements OnInit {
  @Input() onClose: () => void = () => {};
  @Input() userProfile: Profile;

  public profileImage: string = PROFILE_IMAGE_PLACEHOLDER;
  public profileImageFile: File | undefined;
  public imageUploadProgress: number = 10;
  public showProgress: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileImage = this.userProfile.imageUrl;
  }

  public handleChooseImage(files: File[]) {
    const [file] = files;
    this.profileImageFile = file;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      this.profileImage = e.target.result as string;
    };
  }

  public handleUpload() {
    if (this.profileImageFile) {
      this.showProgress = true;
      ProfileModel.uploadProfileImage(
        this.profileImageFile,
        async ([percent, downloadedUrl]) => {
          this.imageUploadProgress = percent;
          if (percent === 100 && downloadedUrl) {
            this.profileService.set('imageUrl', downloadedUrl);
            this.onClose();
            this.showProgress = false;
            this.imageUploadProgress = 0;
          }
        }
      );
    }
  }
}
