import { HasCreatedAt, HasId, HasImageUrl, HasName } from "../../common/types";
import { Tag } from "../tags/types";

export interface Project extends HasId, HasName, HasImageUrl, HasCreatedAt {
    description: string;
    content: string;
    views: number;
    tags: Tag[] | string[];
    url: string;
    pos?: number
}