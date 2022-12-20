import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '@core/models/profile/types';
import { FirebaseSdk } from '../../../core/api';
import { ProfileService } from './services/profile.service';
import { TagsService } from './services/tags.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'admin';

  userProfile: Profile | undefined

  constructor(private profileService: ProfileService, private tagService: TagsService, public router: Router) {
    FirebaseSdk.init();
  }

  ngOnInit() {
    const auth = localStorage.getItem('authenticate');
    if(!auth) {
      this.router.navigate(['/unauthenticate'])
    }

    this.profileService.refreshProfile();
    this.tagService.refreshTags();
    this.profileService.profileCollection.subscribe((profileModel) => {
      if(profileModel) {
        this.userProfile = profileModel.pluckAll()
      }
    })
  }
}
