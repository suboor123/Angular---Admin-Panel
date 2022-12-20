import { MODEL_SYNCED } from "../../common/constants";
import { Events } from "../../lib/event/types";
import { ModelAttributes } from "./types";
import { HasId } from "../../common/types";

export abstract class Model<T> {
  constructor(public attributes: ModelAttributes<T>, private events: Events) {}

  /**
   * Set up proxies
   */
  /* @ts-ignore */
  on = this.events.on;
  /* @ts-ignore */
  trigger = this.events.trigger;
  /* @ts-ignore */
  pluck = this.attributes.get;
  /* @ts-ignore */
  pluckAll = this.attributes.getAll;
  /* @ts-ignore */
  setValues = this.attributes.setField;

  /**
   * Set a the attributes of a model to a new object.
   * This usually happens when a model ha been edited and
   * the changed fields need to update.
   *
   * @param update
   */
  set(update: T) {
    this.attributes.replace(update);
    this.trigger(MODEL_SYNCED);
  }
}
