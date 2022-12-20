import { FirebaseSdk } from "../../api";
import { FirebaseDatabase } from "../../api/database";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Blog } from "./types";
import { Entites } from "@core/common/types";
import { Callback } from "@core/lib/event/types";

export class BlogModel extends Model<Blog> {
  private static path = Entites.Blogs;
  /**
   * Makes a new instance of BlogModel. It requires only the attributes
   * that would be used to instantiate new Blog Model.
   *
   * @param attributes
   */
  static make(attribute: Blog): BlogModel {
    return new BlogModel(new Attributes(attribute), new EventEmitter());
  }

  static get blogCollection(): FirebaseDatabase<Blog> {
    return FirebaseSdk.database<Blog>(this.path);
  }

  static create(blog: Blog): BlogModel {
    this.blogCollection.create(blog);
    return this.make(blog);
  }

  static async makeBlogsCollection(): Promise<BlogModel[]> {
    const blogs = ((await this.blogCollection.syncAll()) || []) as Blog[];
    return (
      blogs
        .map((blog) => {
          if (!blog.tags) blog.tags = [];
          return BlogModel.make(blog);
        })
        // Re order blogs by position
        .sort((a, b) => a.pluck("pos") - b.pluck("pos"))
    );
  }

  static async uploadBlogImage(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "/").upload(image, callback);
  }

  static async syncById(blogId: string): Promise<BlogModel | undefined> {
    const blog = await this.blogCollection.sync(blogId);
    return blog ? BlogModel.make(blog) : undefined;
  }

  static delete(id: string) {
    this.blogCollection.delete(id);
  }

  static update(blog: Blog): BlogModel {
    this.blogCollection.update(blog.id as string, blog);
    return this.make(blog);
  }

  static updateBlogPosition(blog: Blog, pos?: number) {
    this.blogCollection.updateChild(blog.id, "pos", blog.pos);
  }
}
