export class Singleton<T> {
  private instance: T;


  /**
   * The method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public makeSingleton(instance: T): T {
    if (!this.instance) {
      this.instance = instance;
    }

    return instance;
  }
}
