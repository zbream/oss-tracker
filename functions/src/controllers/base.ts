import { Response, Router } from 'express';

export abstract class BaseController {

  abstract readonly handler: Router;

  protected _resSuccess(res: Response, arg: string | object): void {
    const resArg = { result: arg };
    return void res.status(200).json(resArg);
  }

  protected _resFailClient(res: Response, arg: string): void {
    const resArg = { error: arg };
    return void res.status(400).json(resArg);
  }

  protected _resFailServer(res: Response, arg: string): void {
    const resArg = { error: arg };
    return void res.status(500).json(resArg);
  }

}
