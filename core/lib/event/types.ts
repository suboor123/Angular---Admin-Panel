export interface Events {
    on: (eventName: string, callback: () => void) => void;
    trigger: (eventName: string, withArg?: any) => void;
  }
  
  export type Callback = (withArg?: any) => void;
  
  export type EventsMap = { [key: string]: Callback[] };
  