import { Injectable } from '@angular/core';
import { ProfileModel } from '@core/models/profile';
import { Profile } from '@core/models/profile/types';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { handleError } from './service-helper';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileSubject$: BehaviorSubject<ProfileModel | undefined> =
    new BehaviorSubject<ProfileModel | undefined>(undefined);

  public profileCollection: Observable<ProfileModel> =
    this.profileSubject$.asObservable();

  private profile: Profile;

  constructor(private toastr: ToastrService) {}

  refreshProfile() {
    from(ProfileModel.getUserProfile()).subscribe(
      (profileModel: ProfileModel) => {
        if (profileModel) {
          this.profileSubject$.next(profileModel);
          this.profile = profileModel.pluckAll();
        }
      },
      handleError
    );
  }

  update(profile: Profile) {
    const userProfile = { ...(this.profile || {}), ...profile };
    from(ProfileModel.updateUserProfile(userProfile)).subscribe(
      (profileModel) => {
        this.profileSubject$.next(profileModel);
        this.profile = profileModel.pluckAll();
        this.toastr.success('Successfully Saved.');
      },
      handleError
    );
  }

  set<K extends keyof Profile>(key: K, value: Profile[K]) {
    const profile = { ...this.profile, ...{ [key]: value } };
    this.update(profile);
  }
}
