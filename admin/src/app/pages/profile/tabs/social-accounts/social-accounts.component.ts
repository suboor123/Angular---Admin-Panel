import { Component, OnInit } from '@angular/core';
import { Profile, SocialAccounts } from '@core/models/profile/types';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../../services/profile.service';

@Component({
  selector: 'social-accounts',
  templateUrl: './social-accounts.component.html',
  styleUrls: ['./social-accounts.component.css'],
})
export class SocialAccountsComponent implements OnInit {
  public userProfile: Profile;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profileCollection.subscribe((profileModel) => {
      this.userProfile = profileModel.pluckAll();
    });
  }

  handleUpdateSocialMedia(github: string, linkedIn: string, instagram: string) {
    const socialAccount: SocialAccounts = {
      githubUrl: github || '',
      linkedInUrl: linkedIn || '',
      instagramUrl: instagram || '',
    };
    this.profileService.set('social', socialAccount);
  }
}
