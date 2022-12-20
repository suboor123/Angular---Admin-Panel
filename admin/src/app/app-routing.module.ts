import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/app-dashboard/dashboard/dashboard.component';
import { BlogsListComponent } from './pages/blogs/blogs-list/blogs-list.component';
import { ClassListComponent } from './pages/classes/class-list/class-list.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { TagsListComponent } from './pages/tags/tags-list/tags-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'projects',
    component: ProjectListComponent,
  },
  {
    path: 'blogs',
    component: BlogsListComponent,
  },
  {
    path: 'tags',
    component: TagsListComponent,
  },
  {
    path: 'classes',
    component: ClassListComponent,
  },
  {
    path: 'unauthenticate',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
