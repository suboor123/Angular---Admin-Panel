import { FirebaseSdk } from "../../api";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Tag, TagId } from "./types";
import { Entites } from "../../common/types";
import { Callback } from "../../lib/event/types";

export class TagModel extends Model<Tag> {
  private static path = Entites.Tags;
  /**
   * Makes a new instance of ProfileModel. It requires only the attributes
   * that would be used to instantiate new ProfileModel.
   *
   * @param attributes
   */
  public static make(attribute: Tag): TagModel {
    return new TagModel(new Attributes(attribute), new EventEmitter());
  }

  /**
   * Tags collection can access all the methods to operate tags collection
   */
  static get tagsCollection() {
    return FirebaseSdk.database<Tag>(this.path);
  }

  static async syncTags(): Promise<TagModel[]> {
    const tags = await this.tagsCollection.syncAll();
    return tags.map((tag) => this.make(tag));
  }

  static async uploadTagImage(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "/").upload(image, callback);
  }

  static create(tag: Tag) {
    this.tagsCollection.create(tag);
  }

  static delete(id: TagId) {
    this.tagsCollection.delete(id);
  }

  static update(tag: Tag): TagModel {
    this.tagsCollection.update(tag.id, tag)
    return this.make(tag)
  }
}