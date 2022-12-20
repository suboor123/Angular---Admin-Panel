import { Component, OnInit } from '@angular/core';
import { Notify } from '@core/lib/alert';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProjectService } from 'src/app/services/project.service';
import { ModalConfig } from '../modal/modal.types';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public projectModalConfig: ModalConfig = {
    heading: 'ADD PROJECT',
    show: false,
    onClose: () => {
      this.projectModalConfig.show = false;
    },
  };

  constructor(private projectSerivce: ProjectService, private dashboard: DashboardService) { }

  ngOnInit(): void {
  }

  public handleAddProject(): void {
    this.projectSerivce.deselect();
    this.projectModalConfig.show = true;
  }

  public handleLogout() {
    Notify.confirm({
      message: 'Are you sure? you want to logout',
      callback: () => {
        this.dashboard.logout();
      }
    })
  }

}
