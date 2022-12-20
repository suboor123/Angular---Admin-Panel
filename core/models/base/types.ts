

export interface ModelAttributes<T> {
  replace: (update: T) => void;
  setField: <K extends keyof T>(field: K) => (value: T[K]) => void;
  getAll: () => T;
  get: <K extends keyof T>(key: K) => T[K];
}

