import { HasCreatedAt, HasId, HasImageUrl, HasName } from "@core/common/types";
import { Comment } from "../comments/types";
import { Tag, TagId } from "../tags/types";

export interface Blog extends HasId, HasName, HasImageUrl, HasCreatedAt {
  description: string;
  content: string;
  views: number;
  tags: Tag[] | TagId[];
  comments: Comment[];
  pos?: number;
}
