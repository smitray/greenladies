declare module "@artsy/express-reloadable" {
  import {Application, RequestHandler} from 'express';

  export const isDevelopment: boolean;
  export const createReloadable: (app: Application, require: NodeRequire) => (folderPath: string, config?: any) => RequestHandler;
}