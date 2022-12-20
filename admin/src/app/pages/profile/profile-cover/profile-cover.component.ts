import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { ProfileModel } from '@core/models/profile';
import { Profile } from '@core/models/profile/types';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { ProfileService } from '../../../services/profile.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'profile-cover',
  templateUrl: './profile-cover.component.html',
  styleUrls: ['./profile-cover.component.css'],
})
export class ProfileCoverComponent implements OnInit {

  public userProfile: Profile | undefined

  public editProfileModalConfig: ModalConfig = {
    heading: 'Edit Profile',
    show: false,
    onClose: () => (this.editProfileModalConfig.show = false),
  };

  public editProfileImageModalConfig: ModalConfig = {
    heading: `Edit Profile Image`,
    show: false,
    onClose: () => (this.editProfileImageModalConfig.show = false),
  };

  public editCoverImageModalConfig: ModalConfig = {
    heading: `Edit Cover Image`,
    show: false,
    onClose: () => (this.editCoverImageModalConfig.show = false),
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.profileService.profileCollection.subscribe((profileModel: ProfileModel) => {
      if(profileModel) {
        this.userProfile = profileModel.pluckAll();
      }
    })
  }

  public handleEditProfile(): void {
    this.editProfileModalConfig.show = true;
  }

  public handleEditProfileImage(): void {
    this.editProfileImageModalConfig.show = true;
  }

  public handleEditCoverImage(): void {
    this.editCoverImageModalConfig.show = true;
  }
}
