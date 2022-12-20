import { FirebaseSdk } from "../../api";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Profile } from "./types";
import { Entites } from "../../common/types";
import { PROFILE_IMAGE_PLACEHOLDER } from "../../../core/common/constants";
import { Callback } from "../../../core/lib/event/types";

export class ProfileModel extends Model<Profile> {
  private static path = Entites.Profile;
  /**
   * Makes a new instance of ProfileModel. It requires only the attributes
   * that would be used to instantiate new ProfileModel.
   *
   * @param attributes
   */
  static make(attribute: Profile): ProfileModel {
    return new ProfileModel(new Attributes(attribute), new EventEmitter());
  }

  static get profileCollection() {
    return FirebaseSdk.database<Profile>(this.path);
  }

  static async updateUserProfile(profile: Profile) {
    this.profileCollection.setEntity(profile);
    return this.make(profile);
  }

  static async getUserProfile(): Promise<ProfileModel> {
    const profile = (await this.profileCollection.syncEntity()) as Profile;
    if(!profile.imageUrl) profile.imageUrl = PROFILE_IMAGE_PLACEHOLDER;
    if(!profile.coverImageUrl) profile.coverImageUrl = PROFILE_IMAGE_PLACEHOLDER;
    return this.make(profile);
  }

  static async uploadProfileImage(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "/").upload(image, callback);
  }

  static async uploadAcheivementImage(image: File, callback: Callback) {
    return FirebaseSdk.storage("acheivements/").upload(image, callback);
  }
}
