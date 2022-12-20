import { Component, OnInit } from '@angular/core';
import { Notify } from '@core/lib/alert';
import { Profile } from '@core/models/profile/types';
import { ModalConfig } from 'src/app/components/modal/modal.types';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'acheivements',
  templateUrl: './acheivements.component.html',
  styleUrls: ['./acheivements.component.css']
})
export class AcheivementsComponent implements OnInit {

  public addAcheivementModalConfig: ModalConfig = {
    heading: 'Add Acheivement',
    show: false,
    onClose: () => (this.addAcheivementModalConfig.show = false),
  };

  userProfile: Profile
  acheivements: Profile['acheivements'] = []

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.profileCollection.subscribe((pm) => {
      this.userProfile = pm.pluckAll();
      this.acheivements = pm.pluck('acheivements') || []
    })
  }

  handleAddAcheivement() {
    this.addAcheivementModalConfig.show = true
  }

  deleteAcheivement(index: number) {
    Notify.confirm({
      message: 'Acheivement will be deleted',
      callback: () => {
        const acheivements = this.acheivements.filter((a, i) => index !== i);
        this.profileService.set('acheivements', acheivements)
      }
    })
  }

}
