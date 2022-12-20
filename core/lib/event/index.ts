import { Callback, EventsMap } from "./types";

export class EventEmitter {
  eventsMap: EventsMap = {};

  /**
   * Registers an event with a callback. If the event has already been registered,
   * it appends the new callback to the list of existing callbacks for that event.
   *
   * @param eventName
   * @param callback
   */
  on = (eventName: string, callback: Callback): void => {
    const handlers = this.eventsMap[eventName] || [];
    handlers.push(callback);
    this.eventsMap[eventName] = handlers;
  };

  /**
   * Triggers a registered event by the event name. If no callback exists for that event name,
   * UnRegisteredEventException is thrown.
   *
   * @throws UnRegisteredEventException
   * @param eventName
   */
  trigger = (eventName: string, withArg?: any): void => {
    const handler = this.eventsMap[eventName];
    if (!handler || !handler.length) {
      throw new Error("Unregistered event");
    }
    handler.forEach((callback: Callback) => callback(withArg));
  };
}
