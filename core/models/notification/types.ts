import { Entites } from "../../common/types";

export type NotificationType = "view" | "comment";

export interface INotification {
  id?: string;
  createdAt: string;
  type: NotificationType;
  entity: Entites;
  entityId?: string;
  entityName: string;
  seen: boolean;
}

export interface NotificationArgs {
  entity: INotification["entity"];
  entityName: string;
  entityId: string;
  totalViews?: number;
  imageUrl?: string;
}