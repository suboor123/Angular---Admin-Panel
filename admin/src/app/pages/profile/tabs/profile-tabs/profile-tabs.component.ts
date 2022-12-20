import { Component, OnInit } from '@angular/core';

enum ProfileTabs {
  Companies = 'Companies',
  Status = 'About Me',
  SocialAccounts = 'Social Accounts',
  Acheivements = 'Acheivements'
}

@Component({
  selector: 'profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent implements OnInit {

  public profileTabs = Object.values(ProfileTabs);
  public activeTab: string = ProfileTabs.Status;

  constructor() { }

  ngOnInit(): void {
  }

  public handleTabClick(index: number): void {
    this.activeTab = this.profileTabs[index];
  }

}
