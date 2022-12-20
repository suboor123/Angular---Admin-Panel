import { FirebaseSdk } from "../../api";
import { EventEmitter } from "../../lib/event";
import { Attributes } from "../base/attributes";
import { Model } from "../base";
import { Project } from "./types";
import { Entites } from "../../common/types";
import { Callback } from "../../lib/event/types";
import { FirebaseDatabase } from "../../api/database";

export class ProjectModel extends Model<Project> {
  private static path = Entites.Projects;
  /**
   * Makes a new instance of ProjectModel. It requires only the attributes
   * that would be used to instantiate new ProjectModel.
   *
   * @param attributes
   */
  static make(attribute: Project): ProjectModel {
    return new ProjectModel(new Attributes(attribute), new EventEmitter());
  }

  /**
   * Tags collection can access all the methods to operate projects collection
   */
  static get projectsCollection(): FirebaseDatabase<Project> {
    return FirebaseSdk.database<Project>(this.path);
  }

  static async syncProjects(): Promise<ProjectModel[]> {
    const projects = await this.projectsCollection.syncAll();
    return (
      projects
        .map((project) => {
          if (!project.tags) project.tags = [];
          if (!project.pos) project.pos = projects.length;
          return this.make(project);
        })
        // Re order projects by position
        .sort((a, b) => a.pluck("pos") - b.pluck("pos"))
    );
  }

  static async uploadProjectImage(image: File, callback: Callback) {
    return FirebaseSdk.storage(this.path + "/").upload(image, callback);
  }

  static create(project: Project) {
    this.projectsCollection.create(project);
  }

  static delete(id: string) {
    this.projectsCollection.delete(id);
  }

  static update(project: Project): ProjectModel {
    this.projectsCollection.update(project.id as string, project);
    return this.make(project);
  }

  static updateProjectPosition(project: Project, pos?: number) {
    this.projectsCollection.updateChild(project.id, "pos", project.pos);
  }
}
