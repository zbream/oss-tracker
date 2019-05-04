import { NextFunction, Request, Response } from 'express';

type Handler = (req: Request, res: Response, next: NextFunction) => void;

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
