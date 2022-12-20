import { HasId } from "../../common/types";
import { FirebaseApp } from "firebase/app";
import * as DatabaseFunc from "firebase/database";
import { ResponseParser } from "../../lib/parsers/response-parser";
import { RealtimeDatabase } from "../types";
import { endAt } from "firebase/database";
import { echo } from "@core/lib/echo";

const {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  query,
  orderByChild,
  equalTo,
  remove,
  startAt,
  endBefore,
} = DatabaseFunc;

export class FirebaseDatabase<T extends HasId> {
  /**
   * Holds the instance of firebase realtime database
   */
  database: RealtimeDatabase;

  constructor(private firebaseApp: FirebaseApp, private path: string) {
    this.database = getDatabase(this.firebaseApp);
  }

  /**
   * Insert a record in firebase realtime database
   * @param entity
   *
   */
  create(entity: T) {
    if (entity.id) {
      set(ref(this.database, this.path + "/" + entity.id), entity);
    } else {
      push(ref(this.database, this.path), entity);
    }
  }

  /**
   * Insert multiple records in firebase realtime database
   * @param enities
   */
  createMultiple(enities: T[]) {
    enities.forEach((entity) => {
      this.create(entity);
    });
  }

  /**
   * Updates mutliple values in a collection
   * @param id
   * @param entity
   *
   */
  update<K extends keyof T>(id: string, entity: Partial<T>) {
    if (id) {
      const valuesToUpdate: K[] = Object.keys(entity) as K[];
      valuesToUpdate.forEach((key: K) => {
        this.updateChild(id, key, entity[key] as any);
      });
    }
  }

  /**
   * updates the value of particular property in a collection
   * @param id
   * @param key
   * @param entity
   */
  updateChild<K extends keyof T>(id: string, key: K, entity: T[K]) {
    if (id) {
      set(
        ref(this.database, this.path + "/" + id + "/" + (key as string)),
        entity
      );
    }
  }

  setEntity<T>(entity: T) {
    set(ref(this.database, this.path + "/"), entity);
  }

  delete(id: string) {
    remove(ref(this.database, this.path + "/" + id));
  }

  deleteChild(enetityId: string, childId: string) {
    const path = this.path + "/" + childId;
    remove(ref(this.database, path));
  }

  /**
   * Sync data from a collection by its id
   * @param id
   * @returns
   */
  async sync(id: string) {
    const refs = ref(this.database);
    const path = `${this.path}/${id}`;
    const snapshot = await get(child(refs, path));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return undefined;
  }

  /**
   * Sync entity collection by a given condition
   * @param key
   * @returns
   */
  syncWhere<K extends keyof T>(key: K) {
    try {
      const refs = ref(this.database, `${this.path}/`);
      const childRef = `${key as string}`;
      return {
        equalTo: function (val: string) {
          return this._exec([equalTo(val)]);
        },
        from: function (val: string) {
          return this._exec([startAt(val)]);
        },
        before: function (val: string) {
          return this._exec([endAt(val)]);
        },
        _exec: async function (q) {
          const queryConstraints = [orderByChild(childRef), ...q];
          const snapshot = await get(query(refs, ...queryConstraints));

          return snapshot.exists()
            ? new ResponseParser(snapshot.val()).parse()
            : [];
        },
      };
    } catch (e) {
      echo("Error", [JSON.stringify(e)]);
    }
  }

  /**
   * Sync the collection of entity
   * @returns
   */
  async syncAll(): Promise<T[]> {
    const refs = ref(this.database);
    const path = `${this.path}/`;
    const snapshot = await get(child(refs, path));
    if (snapshot.exists()) {
      return new ResponseParser(snapshot.val()).parse();
    }
    return [];
  }

  async syncEntity(): Promise<T | undefined> {
    const refs = ref(this.database);
    const path = `${this.path}/`;
    const snapshot = await get(child(refs, path));
    if (snapshot && snapshot.exists()) {
      return snapshot.val();
    }
    return undefined;
  }
}
