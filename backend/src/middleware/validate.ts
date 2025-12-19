import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware factory for validating request body against Zod schema
 * @param schema - Zod schema to validate against
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
