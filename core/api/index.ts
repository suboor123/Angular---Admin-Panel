import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebase_config } from "../config/firebase-config";
import { Singleton } from "../lib/singleton";
import { FirebaseDatabase } from "./database";
import { FirebaseBucket } from "./storage";

export class FirebaseSdk {
  private static instance: FirebaseSdk;
  private static firebaseApp: FirebaseApp;
  private constructor() {}

  public static init(): FirebaseSdk {
    if (!this.instance) this.firebaseApp = initializeApp(firebase_config);
    this.instance = new Singleton<FirebaseSdk>().makeSingleton(
      new FirebaseSdk()
    );
    return this.instance;
  }

  public static database<E>(path: string): FirebaseDatabase<E> {
    return new FirebaseDatabase<E>(this.firebaseApp, path);
  }

  static storage(path: string): FirebaseBucket {
    return new FirebaseBucket(this.firebaseApp, path);
  }
}
