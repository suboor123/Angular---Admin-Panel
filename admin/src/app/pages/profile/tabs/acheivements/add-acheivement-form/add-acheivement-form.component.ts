import { Component, Input, OnInit } from '@angular/core';
import { ProfileModel } from '@core/models/profile';
import { Acheivement, Profile } from '@core/models/profile/types';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../../../services/profile.service';

@Component({
  selector: 'add-acheivement-form',
  templateUrl: './add-acheivement-form.component.html',
  styleUrls: ['./add-acheivement-form.component.css'],
})
export class AddAcheivementFormComponent implements OnInit {
  @Input() onClose: () => void;

  public imageFile: File | undefined;
  public imageUrl: string | undefined;
  public imageUploadProgress: number = 0;
  public showProgress: boolean = false;
  public userProfile: Profile;

  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.profileService.profileCollection.subscribe((profileModel) => {
      this.userProfile = profileModel.pluckAll();
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

  private validateForm(title: string, description: string): boolean {
    let isValidated = true;
    const errors = [];

    if (!title.trim().length) {
      errors.push('Title');
    }

    if (!description.trim().length) {
      errors.push('Description');
    }

    if(!this.imageFile) {
      errors.push('Please select an image file');
    }

    if (errors.length) {
      isValidated = false;
      errors.forEach((field) => {
        this.toastr.error(`Invalid field ${field}`);
      });
    }

    return isValidated;
  }

  public handleSubmit(title: string, description: string) {
    const isValidated = this.validateForm(title, description);

    if (isValidated) {
      this.showProgress = true;
      ProfileModel.uploadProfileImage(
        this.imageFile,
        async ([percent, downloadedUrl]) => {
          this.imageUploadProgress = percent;
          if (percent === 100 && downloadedUrl) {
            const acheivement: Acheivement = {
              title,
              description,
              imageUrl: downloadedUrl,
            };

            const acheivements = [
              ...(this.userProfile.acheivements || []),
              acheivement,
            ];
            this.profileService.set('acheivements', acheivements);

            this.showProgress = false;
            this.imageUploadProgress = 0;

            this.onClose();
          }
        }
      );
    }
  }
}
