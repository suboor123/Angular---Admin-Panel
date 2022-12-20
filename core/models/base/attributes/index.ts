export class Attributes<T> {
    constructor(private data: T) {}
  
    /**
     * Gets the specified filed off data attributes.
     *
     * @param key
     */
    get = <K extends keyof T>(key: K): T[K] => {
      return this.data[key];
    };
  
    /**
     * Updates the entire data/attributes with newly updated data.
     *
     * @param update
     */
    replace(update: T) {
      Object.assign(this.data, update); // this is where we have to freeze the object/make it immutable.
    }
  
    /**
     * Sets a field of T to a value
     * @param field
     */
    setField = <K extends keyof T>(field: K): ((value: T[K]) => void) => {
      return (value: T[K]) => (this.data[field] = value);
    };
  
    /**
     * Get the entire data that represents attributes.
     */
    getAll = (): T => {
      return this.data;
    };
  }
  