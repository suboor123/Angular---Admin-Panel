import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '@core/models/profile/types';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  profleForm: FormGroup;
  @Input() onClose: () => void;
  public profile: Profile | undefined;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.getUserProfile();
  }

  initProfileForm(): void {
    this.profleForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
      aboutMe: ['', [Validators.required, Validators.minLength(15)]],
    });
  }

  getUserProfile() {
    this.profileService.profileCollection.subscribe((profileModel) => {
      if (profileModel) {
        this.profile = profileModel.pluckAll();
        this.profleForm.setValue({
          name: this.profile.name,
          email: this.profile.email,
          designation: this.profile.designation,
          aboutMe: this.profile.aboutMe
        })
      }
    });
  }

  onSubmission() {
    if (!this.profleForm.valid) return;
    const userProfile: Profile = {
      ...this.profleForm.value,
    };

    this.profileService.update(userProfile);
    this.onClose();
  }
}
