import { HasCreatedAt, HasId, HasName } from "@core/common/types";

export interface Comment extends HasId, HasName, HasCreatedAt {
  comment: string;
}
