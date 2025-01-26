import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) =>
    // immediately wraps a function in promise and either resolves or rejects
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
// automatically passes error to express error middleware from catch
export default asyncHandler;
