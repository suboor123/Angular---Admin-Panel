import { Component, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Profile } from '@core/models/profile/types';
import { ProfileService } from '../../services/profile.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  userProfile: Profile | undefined


  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.profileService.refreshProfile();
    this.profileService.profileCollection.subscribe((profileModel) => {
      this.userProfile = profileModel.pluckAll();
    })
  }


}
