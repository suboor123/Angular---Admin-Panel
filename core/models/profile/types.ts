import { HasId, HasImageUrl, HasName } from "../../common/types";

export interface Acheivement extends HasImageUrl {
  title: string;
  description?: string;
}

export interface Company extends HasId, HasName {
  from: string;
  to: string;
  currentlyWorking: boolean;
  description: string;
}

export interface SocialAccounts {
  githubUrl?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
}

export interface Profile extends HasName, HasImageUrl {
  designation: string;
  aboutMe: string;
  status: string;
  acheivements: Acheivement[];
  companies: Company[];
  email: string;
  social: SocialAccounts;
  coverImageUrl: string;
}
