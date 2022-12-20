import { FirebaseSdk } from "../../api";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Entites } from "../../common/types";
import { Callback } from "../../lib/event/types";
import { Session } from "./types";
import { FirebaseDatabase } from "../../api/database";
import { echo } from "@core/lib/echo";
import { DateUtils } from "@core/utils/Date";

const HALF_MINUTE_TO_SECONDS = 1800;

export class SessionModel extends Model<Session> {
  private static readonly path = Entites.Sessions;
  private static readonly currentDate = new Date().toISOString().slice(0, 10);
  /**
   * Makes a new instance of SessionModel. It requires only the attributes
   * that would be used to instantiate new SessionModel.
   *
   * @param attributes
   */
  static make(attribute: Session): SessionModel {
    return new SessionModel(new Attributes(attribute), new EventEmitter());
  }

  /**
   * Tags collection can access all the methods to operate session collection
   */
  static get sessionCollection(): FirebaseDatabase<Session> {
    return FirebaseSdk.database<Session>(this.path);
  }

  static async sync(): Promise<SessionModel[]> {
    const sessions = await this.sessionCollection.syncAll();
    return sessions.map((session) => {
      if (!session.tags) session.tags = [];
      if(!session.attachedFiles) session.attachedFiles = [];
      return this.make(session);
    });
  }

  static async uploadSessionImage(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "/").upload(image, callback);
  }

  static create(session: Session) {
    this.sessionCollection.create(session);
  }

  static delete(id: string) {
    this.sessionCollection.delete(id);
  }

  static update(session: Session): SessionModel {
    this.sessionCollection.update(session.id as string, session);
    return this.make(session);
  }

  static async syncUpcomingSessions() {
    const sessions: Session[] = await this.sessionCollection
      .syncWhere("date")
      .from(this.currentDate);
    const upcomigSessions = (sessions || [])
      .map((session) => {
        if (!session.tags) session.tags = [];
        if(!session.attachedFiles) session.attachedFiles = [];
        return this.make(session);
      })
      .filter((sm) => !sm.isPastSession);
    return upcomigSessions;
  }

  static async syncPastSessions() {
    const sessionModels = await this.sync();
    return sessionModels.filter((sm) => sm.isPastSession)
    
  }

  get isPastSession() {
    const d = new Date();
    const sessionDate = new Date(
      `${this.pluck("date")} ${this.pluck("sessionTiming").end}`
    );
    return d > sessionDate;
  }

  get canExposeStreamUrl() {
    const t1 = new Date(
      this.pluck("date") + " " + this.pluck("sessionTiming").start
    );
    const t2 = new Date();

    return DateUtils.dateDifferenceToSeconds(t2, t1);
  }

  static uploadSessionResource(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "-resources/").upload(
      image,
      callback
    );
  }
}
