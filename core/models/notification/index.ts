import { FirebaseSdk } from "../../api";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Entites } from "../../common/types";
import { INotification, NotificationArgs, NotificationType } from "./types";


export class NotificationModel extends Model<INotification> {
  private static path = Entites.Notifications;

  /**
   * Makes a new instance of NotificationModel. It requires only the attributes
   * that would be used to instantiate new NotificationModel.
   *
   * @param attributes
   */
  public static make(attribute: INotification): NotificationModel {
    return new NotificationModel(new Attributes(attribute), new EventEmitter());
  }

  public static get notificationCollection() {
    return FirebaseSdk.database<INotification>(this.path);
  }

  public static async syncAllNotifications(): Promise<NotificationModel[]> {
    const notifications = await this.notificationCollection.syncAll();
    return notifications.map((notification) => {
      return this.make(notification);
    }).reverse();
  }

  public static async syncUnreadNotification(): Promise<NotificationModel[]> {
    const notificationModels = await this.syncAllNotifications();
    const unread = notificationModels.filter((nm) => !nm.hasSeen).reverse();
    return unread;
  }

  public static async syncOldNotifications(): Promise<NotificationModel[]> {
    const notificationModels = await this.syncAllNotifications();
    return notificationModels.filter((nm) => nm.hasSeen).reverse();
  }

  public static markAsRead(notification: INotification) {
    this.notificationCollection.updateChild(notification.id!, "seen", true);
  }

  public static markAsUnread(notification: INotification) {
    this.notificationCollection.updateChild(notification.id!, "seen", false);
  }

  public static delete(id: string) {
    this.notificationCollection.delete(id);
  }

  private static structureNotification(
    args: NotificationArgs,
    type: NotificationType
  ): INotification {
    return {
      createdAt: new Date().toISOString(),
      type,
      entity: args.entity,
      entityId: args.entityId,
      entityName: args.entityName,
      seen: false,
    };
  }

  public static generateViewNotification(args: NotificationArgs) {
    const notification = this.structureNotification(args, "view");
    this.notificationCollection.create(notification);
  }

  public static generateCommentNotification(args: NotificationArgs) {
    const notification = this.structureNotification(args, "comment");
    this.notificationCollection.create(notification);
  }

  public get hasSeen(): boolean {
    return this.pluck("seen") === true;
  }

  public get isCommentNotification() {
    return this.pluck("type") === "comment";
  }

  public get isViewNotification() {
    return this.pluck("type") === "view";
  }

}
