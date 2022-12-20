import { EventEmitter } from "../../lib/event";
import { FirebaseApp } from "firebase/app";
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Callback } from "../../lib/event/types";
import { UPLOADED, STATE_CHANGED } from "../../common/constants"

export class FirebaseBucket {
  private storage: FirebaseStorage;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor( 
    private readonly firebaseApp: FirebaseApp,
    private readonly path: string
  ) {
    this.storage = getStorage(firebaseApp);
  }

  public upload(file: File, callback: Callback = () => {}) {
    const storageRef = ref(this.storage, `/${this.path}/${file.name + '___' + new Date().getMilliseconds() + file.name }`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    let uploadationPercent = 0; 
    let imageUrl = "";
    this.eventEmitter.on(UPLOADED, () =>
      callback([uploadationPercent, imageUrl])
    );
    uploadTask.on(
      STATE_CHANGED,
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        uploadationPercent = percent;
        this.eventEmitter.trigger(UPLOADED);
      },
      (err) => {
        throw Error(JSON.stringify(err));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          imageUrl = url;
          this.eventEmitter.trigger(UPLOADED);
        });
      }
    );
  }
}
