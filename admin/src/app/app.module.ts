/**
 * @Modules
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CountdownModule } from 'ngx-countdown';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TooltipModule } from 'ng2-tooltip-directive';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { TimeagoModule } from 'ngx-timeago';

/**
 * @Components
 */
import { AppComponent } from './app.component';
import { BlogsListComponent } from './pages/blogs/blogs-list/blogs-list.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { TagsListComponent } from './pages/tags/tags-list/tags-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ButtonComponent } from './components/button/button.component';
import { DashboardComponent } from './pages/app-dashboard/dashboard/dashboard.component';
import { ModalComponent } from './components/modal/modal.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';
import { CardComponent } from './components/card/card.component';
import { ProfileCoverComponent } from './pages/profile/profile-cover/profile-cover.component';
import { EditProfileImageComponent } from './pages/profile/edit-profile-image/edit-profile-image.component';
import { EditCoverImageComponent } from './pages/profile/edit-cover-image/edit-cover-image.component';
import { ProfileTabsComponent } from './pages/profile/tabs/profile-tabs/profile-tabs.component';
import { CompaniesComponent } from './pages/profile/tabs/companies/companies.component';
import { CurrentStatusComponent } from './pages/profile/tabs/about/current-status.component';
import { SocialAccountsComponent } from './pages/profile/tabs/social-accounts/social-accounts.component';
import { AcheivementsComponent } from './pages/profile/tabs/acheivements/acheivements.component';
import { AddAcheivementFormComponent } from './pages/profile/tabs/acheivements/add-acheivement-form/add-acheivement-form.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { TableComponent } from './components/table/table.component';
import { TagFormComponent } from './pages/tags/tag-form/tag-form.component';
import { ViewTagComponent } from './pages/tags/view-tag/view-tag.component';
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';
import { PanelComponent } from './components/panel/panel.component';
import { AddBtnComponent } from './components/add-btn/add-btn.component';
import { TagSelectorComponent } from './pages/tags/tag-selector/tag-selector.component';
import { HtmlEditorComponent } from './components/html-editor/html-editor.component';
import { ProjectCardComponent } from './pages/projects/project-card/project-card.component';
import { BlogCardComponent } from './pages/blogs/blog-card/blog-card.component';
import { BlogFormComponent } from './pages/blogs/blog-form/blog-form.component';
import { GrowerDirective } from './directives/grower.directive';
import { ClassListComponent } from './pages/classes/class-list/class-list.component';
import { InitialLoaderComponent } from './components/initial-loader/initial-loader.component';
import { SessionFormComponent } from './pages/classes/session-form/session-form.component';
import { SessionCardComponent } from './pages/classes/session-card/session-card.component';
import { SessionLoaderComponent } from './pages/classes/session-loader/session-loader.component';
import { EntityCountComponent } from './pages/app-dashboard/entity-count/entity-count.component';
import { ViewSessionComponent } from './pages/classes/view-session/view-session.component';
import { AttachSessionFileComponent } from './pages/classes/attach-session-file/attach-session-file.component';
import { SessionCountdownComponent } from './pages/classes/session-countdown/session-countdown.component';
import { LoginComponent } from './pages/login/login.component';
import { SessionListComponent } from './pages/app-dashboard/session-list/session-list.component';
import { MessageListComponent } from './pages/app-dashboard/message-list/message-list.component';
import { RecentProjectsComponent } from './pages/app-dashboard/recent-projects/recent-projects.component';
import { ReorderComponent } from './components/reorder/reorder.component';
import { NotificationListComponent } from './pages/app-dashboard/notification-list/notification-list.component';
import { VisitorListComponent } from './pages/app-dashboard/visitor-list/visitor-list.component';

@NgModule({
  declarations: [
    AppComponent,
    BlogsListComponent,
    SidebarComponent,
    HeaderComponent,
    ProfileComponent,
    ProjectListComponent,
    TagsListComponent,
    ButtonComponent,
    DashboardComponent,
    ModalComponent,
    EditProfileComponent,
    CardComponent,
    ProfileCoverComponent,
    EditProfileImageComponent,
    EditCoverImageComponent,
    ProfileTabsComponent,
    CompaniesComponent,
    CurrentStatusComponent,
    SocialAccountsComponent,
    AcheivementsComponent,
    AddAcheivementFormComponent,
    ProgressBarComponent,
    TableComponent,
    TagFormComponent,
    ViewTagComponent,
    ProjectFormComponent,
    PanelComponent,
    AddBtnComponent,
    TagSelectorComponent,
    HtmlEditorComponent,
    ProjectCardComponent,
    BlogCardComponent,
    BlogFormComponent,
    GrowerDirective,
    ClassListComponent,
    InitialLoaderComponent,
    SessionFormComponent,
    SessionCardComponent,
    SessionLoaderComponent,
    EntityCountComponent,
    ViewSessionComponent,
    AttachSessionFileComponent,
    SessionCountdownComponent,
    LoginComponent,
    SessionListComponent,
    MessageListComponent,
    RecentProjectsComponent,
    ReorderComponent,
    NotificationListComponent,
    VisitorListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    AngularEditorModule,
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      loadingText: 'This item is actually loading...',
    }),
    CountdownModule,
    TooltipModule.forRoot({ hideDelayTouchscreen: 0, 'hide-delay': 0 }),
    DndListModule,
    TimeagoModule.forRoot(),
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
