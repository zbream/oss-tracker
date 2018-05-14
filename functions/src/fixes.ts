import { NextFunction, Request, Response } from 'express';

type AppHandler = (req: Request, res: Response) => void;
type Handler = (req: Request, res: Response, next: NextFunction) => void;

/**
 * Firebase Cloud Function: calling a root function without a trailing `/` will break Express.
 * Add that trailing `/` if necessary.
 *
 * See: https://github.com/firebase/firebase-functions/issues/27#issuecomment-341253842
 *
 * @param handler the handler (an Express app) to handle the updated request
 */
export function fbCloudFunctionRootUrlFix(handler: AppHandler): AppHandler {
  return (req: Request, res: Response) => {
    if (!req.url || !req.path) {
      req.url = `/${req.url || ''}`;
    }
    handler(req, res);
  }
}

/**
 * Firebase Hosting: rewrite will redirect `<app>/api/...` to `<function>/api/api/...`.
 * Remove that extra `/api`.
 *
 * See: https://stackoverflow.com/a/49216233/8820824
 *
 * @param apiPrefix prefix as configured in firebase.json
 */
export function fbHostingRedirectUrlFix(apiPrefix: string): Handler {
  const actualUrlIndex = apiPrefix.length + 1;
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.url.indexOf(`/${apiPrefix}/`) === 0) {
      req.url = req.url.substring(actualUrlIndex);
    }
    next();
  }
}
