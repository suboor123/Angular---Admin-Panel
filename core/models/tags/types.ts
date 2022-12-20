import { HasId, HasImageUrl, HasName } from "@core/common/types";

export type SkillLevelTypes = "expert" | "medium" | "basic";

export enum SkillsLevel {
  Expert = "Expert",
  Medium = "Medium",
  Basic = "Basic",
}

export interface Tag extends HasId, HasName, HasImageUrl {
  level: SkillLevelTypes, 
  description: string;
}

export type TagId = string;