import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Origin:", req.headers.host, "Resource:", req.originalUrl, "Method:", req.method.toUpperCase());
    res.setTimeout(5000000, function () {
      console.log('Request has timed out.');
      res.status(408).json({ error: 'Request timeout' });
    });
    next();
  }
}