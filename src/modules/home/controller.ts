import { Request, Response } from 'express';

export default class HomeController {
  async home(req: Request, res: Response): Promise<void> {
    res.send('This is my home page');
  }
}
