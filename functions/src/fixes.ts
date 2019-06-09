import { RequestHandler } from 'express';

/**
 * Firebase Hosting: rewrite will redirect `<app>/api/...` to `<function>/api/api/...`.
 * Remove that extra `/api`.
 *
 * See: https://stackoverflow.com/a/49216233/8820824
 *
 * @param apiPrefix prefix as configured in firebase.json
 */
export function fbHostingRedirectUrlFix(apiPrefix: string): RequestHandler {
  const regex = new RegExp(`^/${apiPrefix}/?`);
  return (req, res, next) => {
    req.url = req.url.replace(regex, '/');
    next();
  }
}
