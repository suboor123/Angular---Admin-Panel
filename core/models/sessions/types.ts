import { HasCreatedAt, HasId, HasImageUrl, HasName } from "../../common/types";
import { Tag } from "../tags/types";

export type SessionType = 'all' | 'upcoming' | 'past' | 'video'
export interface SessionResources {
  name: string;
  url: string;
}

export interface Session extends HasId, HasName, HasImageUrl, HasCreatedAt {
  description: string;
  views: number;
  tags: Tag[] | string[];
  url: string;
  sessionTiming: {
    start: string;
    end: string;
  };
  date: string;
  attachedFiles?: SessionResources[]
  videoUrl?: string;
}
