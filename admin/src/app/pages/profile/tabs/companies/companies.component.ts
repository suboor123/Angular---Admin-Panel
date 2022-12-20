import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '@core/decorators/unsubscribe';
import { Notify } from '@core/lib/alert';
import { Company, Profile } from '@core/models/profile/types';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../../services/profile.service';

@UnsubscribeOnDestroy()
@Component({
  selector: 'companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent implements OnInit, OnDestroy {
  public currentlyWorking: boolean = false;
  public userProfile: Profile;
  public showAddCompanyForm: boolean = false;

  userProfileSubscription$: Subscription;

  constructor(
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.userProfileSubscription$ =
      this.profileService.profileCollection.subscribe((profileModel) => {
        this.userProfile = profileModel.pluckAll();
      });
  }

  public handleCurrentlyWorkingCheckbox(checked: boolean) {
    this.currentlyWorking = checked;
  }

  public handleShowCompanyForm() {
    this.showAddCompanyForm = true;
  }

  public handleHideCompanyForm() {
    this.showAddCompanyForm = false;
  }

  private validateForm(
    name: string,
    description: string,
    startDate: string
  ): boolean {
    let validated = true;
    const errors = [];

    if (!name.trim().length) {
      errors.push('Name');
    }

    if (!description.trim().length) {
      errors.push('Job Description');
    }

    if (!startDate.trim().length) {
      errors.push('Start Date');
    }

    if (errors.length) {
      errors.forEach((field) => {
        this.toastr.error(`Invalid field ${field}`);
      });
      return !validated;
    }

    return validated;
  }

  public onSubmit(
    companyName: string,
    companyDescription: string,
    startDate: string,
    endDate: string
  ) {
    const isValidated = this.validateForm(
      companyName,
      companyDescription,
      startDate
    );

    if (isValidated) {
      const addedCompany: Company = {
        name: companyName,
        description: companyDescription,
        from: startDate,
        to: endDate || '',
        currentlyWorking: this.currentlyWorking,
      };
      const companies: Profile['companies'] = [
        ...(this.userProfile.companies || []),
        addedCompany,
      ];

      this.profileService.set('companies', companies);
    }
  }

  deleteCompany(index: number) {
    Notify.confirm({
      message: 'Company will be deleted parmanently',
      callback: () => {
        const companies = this.userProfile.companies.filter(
          (c, i) => index !== i
        );
        this.profileService.set('companies', companies);
      },
    });
  }

  handleSwapUp(index: number) {
    if (index === 0) return;

    const prevIndex = index - 1;
    const element = this.userProfile.companies[index];
    const prevElement = this.userProfile.companies[prevIndex];

    this.userProfile.companies[index] = prevElement;
    this.userProfile.companies[prevIndex] = element;

    const companies = [...this.userProfile.companies];
    this.profileService.set('companies', companies);
  }

  handleSwapDown(index: number) {
    const isLastElement = this.userProfile.companies.length - 1;
    if (index === isLastElement) return;

    const nextIndex = index + 1;
    const element = this.userProfile.companies[index];
    const nextElement = this.userProfile.companies[nextIndex];

    this.userProfile.companies[index] = nextElement;
    this.userProfile.companies[nextIndex] = element;

    const companies = [...this.userProfile.companies];
    this.profileService.set('companies', companies);
  }
}
