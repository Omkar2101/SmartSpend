import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const service = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
