import { Response, Router } from 'express';

export abstract class BaseController {

  abstract readonly handler: Router;

  protected resSuccess(res: Response, arg: string | object): void {
    const responseArg = { result: arg };
    return void res.status(200).json(responseArg);
  }

  protected resFailClient(res: Response, arg: string): void {
    const responseArg = { error: arg };
    return void res.status(400).json(responseArg);
  }

  protected resFailServer(res: Response, arg: string): void {
    const responseArg = { error: arg };
    return void res.status(500).json(responseArg);
  }

}
