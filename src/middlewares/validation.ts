import { Request, Response, NextFunction } from 'express';
import { Schema } from 'yup';

const Validation =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<object> => {
    const body = req.body;

    try {
      await schema.validate(body);
      next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

export default Validation;
