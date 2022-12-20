import { echo } from"../lib/echo";

interface HasPrototype {
  prototype: any;
  name: string;
}

/**
 * Automatically unsubscribe all the subscription in a component.
 * When a component destroy
 *
 */
export function UnsubscribeOnDestroy<T extends HasPrototype>() {
  return function (constructor: T) {
    const orig = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function () {
      const obs$: any[] = [];
      for (const prop in this) {
        const property = this[prop];
        if (typeof property?.unsubscribe === "function") {
          
          echo('Unsubscribing', [`Component: ${constructor.name}`, `Property: ${prop}`])
          property.unsubscribe();
        }
        orig?.apply();
      }
    };
  };
}
